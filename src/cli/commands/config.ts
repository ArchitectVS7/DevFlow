import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { AgentManager } from '../../core/agent-manager.js';
import { DevFlowConfig } from '../../types/config.js';



export default class Config extends Command {
  static description = 'Manage DevFlow configuration';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> get agent',
    '<%= config.bin %> <%= command.id %> set agent cursor',
    '<%= config.bin %> <%= command.id %> edit',
  ];

  static args = {
    action: Args.string({
      description: 'Action to perform (get, set, edit, reset)',
      options: ['get', 'set', 'edit', 'reset'],
      required: false,
    }),
    key: Args.string({
      description: 'Configuration key',
      required: false,
    }),
    value: Args.string({
      description: 'Configuration value (for set action)',
      required: false,
    }),
  };

  static flags = {
    global: Flags.boolean({
      char: 'g',
      description: 'Use global configuration (not implemented yet)',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Config);

    if (flags.global) {
      this.warn('Global configuration is not yet supported. Using project configuration.');
    }

    const devflowDir = path.join(process.cwd(), '.devflow');
    const configPath = path.join(devflowDir, 'config.json');

    if (!fs.existsSync(devflowDir) || !fs.existsSync(configPath)) {
      this.error(
        chalk.red('No .devflow directory found.') +
        '\n' +
        chalk.yellow('Run ') +
        chalk.cyan('devflow init') +
        chalk.yellow(' to initialize DevFlow in this project.')
      );
    }

    // If no action specified, show interactive menu
    if (!args.action) {
      await this.showInteractiveMenu(configPath);
      return;
    }

    switch (args.action) {
      case 'get':
        await this.getConfig(configPath, args.key);
        break;
      case 'set':
        await this.setConfig(configPath, args.key, args.value);
        break;
      case 'edit':
        await this.editConfig(configPath);
        break;
      case 'reset':
        await this.resetConfig(configPath);
        break;
      default:
        this.error(chalk.red(`Unknown action: ${args.action}`));
    }
  }

  private async showInteractiveMenu(configPath: string): Promise<void> {
    const config = this.loadConfig(configPath);

    this.log(chalk.bold.cyan('⚙️  DevFlow Configuration\n'));
    this.displayConfig(config);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'View current configuration', value: 'view' },
          { name: 'Change agent', value: 'change-agent' },
          { name: 'Edit preferences', value: 'edit-preferences' },
          { name: 'Reset to defaults', value: 'reset' },
          { name: 'Exit', value: 'exit' },
        ],
      },
    ]);

    switch (action) {
      case 'view':
        // Already displayed above
        break;
      case 'change-agent':
        await this.changeAgent(configPath, config);
        break;
      case 'edit-preferences':
        await this.editPreferences(configPath, config);
        break;
      case 'reset':
        await this.resetConfig(configPath);
        break;
      case 'exit':
        return;
    }
  }

  private async getConfig(configPath: string, key?: string): Promise<void> {
    const config = this.loadConfig(configPath);

    if (!key) {
      this.log(chalk.bold.cyan('⚙️  Current Configuration\n'));
      this.displayConfig(config);
      return;
    }

    const value = this.getNestedValue(config as unknown as Record<string, unknown>, key);

    if (value === undefined) {
      this.error(chalk.red(`Configuration key "${key}" not found`));
    }

    this.log(chalk.cyan(key) + chalk.gray(': ') + JSON.stringify(value, null, 2));
  }

  private async setConfig(configPath: string, key?: string, value?: string): Promise<void> {
    if (!key || value === undefined) {
      this.error('Usage: devflow config set <key> <value>');
    }

    const config = this.loadConfig(configPath);

    // Parse value as JSON if possible
    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(value);
    } catch {
      parsedValue = value;
    }

    this.setNestedValue(config as unknown as Record<string, unknown>, key, parsedValue);
    this.saveConfig(configPath, config);

    this.log(chalk.green(`✅ Set ${chalk.cyan(key)} to ${JSON.stringify(parsedValue)}`));
  }

  private async editConfig(configPath: string): Promise<void> {
    const config = this.loadConfig(configPath);
    await this.editPreferences(configPath, config);
  }

  private async resetConfig(configPath: string): Promise<void> {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to reset configuration to defaults?',
        default: false,
      },
    ]);

    if (!confirm) {
      this.log(chalk.gray('Cancelled'));
      return;
    }

    const config = this.loadConfig(configPath);
    const defaultConfig = this.getDefaultConfig(config.providers[0]);

    this.saveConfig(configPath, defaultConfig);
    this.log(chalk.green('✅ Configuration reset to defaults'));
  }

  private async changeAgent(configPath: string, config: DevFlowConfig): Promise<void> {
    const agentManager = new AgentManager();
    const availableAgents = await agentManager.detectAgents();

    if (availableAgents.length === 0) {
      this.error('No supported agents detected in this project');
    }

    const { newAgent } = await inquirer.prompt([
      {
        type: 'list',
        name: 'newAgent',
        message: 'Select agent:',
        choices: availableAgents.map(agent => ({
          name: agent.displayName,
          value: agent.name,
        })),
        default: config.providers[0],
      },
    ]);

    if (newAgent === config.providers[0]) {
      this.log(chalk.gray('No changes made'));
      return;
    }

    config.providers = [newAgent];
    this.saveConfig(configPath, config);

    this.log(chalk.green(`✅ Agent changed to ${newAgent}`));
    this.log(chalk.yellow('\n⚠️  Run ') + chalk.cyan('devflow update') + chalk.yellow(' to update slash commands'));
  }

  private async editPreferences(configPath: string, config: DevFlowConfig): Promise<void> {
    const preferences = config.preferences || {};

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'autoOpenOutputs',
        message: 'Auto-open generated outputs?',
        default: preferences.autoOpenOutputs || false,
      },
      {
        type: 'confirm',
        name: 'verboseLogging',
        message: 'Enable verbose logging?',
        default: preferences.verboseLogging || false,
      },
      {
        type: 'confirm',
        name: 'preserveSessions',
        message: 'Preserve completed sessions?',
        default: preferences.preserveSessions !== false, // Default to true
      },
    ]);

    config.preferences = answers;
    this.saveConfig(configPath, config);

    this.log(chalk.green('\n✅ Preferences updated'));
  }

  private loadConfig(configPath: string): DevFlowConfig {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (error) {
      this.error(chalk.red(`Failed to load configuration: ${(error as Error).message}`));
    }
  }

  private saveConfig(configPath: string, config: DevFlowConfig): void {
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      this.error(chalk.red(`Failed to save configuration: ${(error as Error).message}`));
    }
  }

  private displayConfig(config: DevFlowConfig): void {
    this.log(`  ${chalk.gray('Version:')} ${config.version}`);
    this.log(`  ${chalk.gray('Agent:')} ${chalk.cyan(config.providers[0])}`);

    if (config.preferences) {
      this.log(`\n  ${chalk.bold('Preferences:')}`);
      this.log(`    ${chalk.gray('Auto-open outputs:')} ${config.preferences.autoOpenOutputs ? chalk.green('yes') : chalk.gray('no')}`);
      this.log(`    ${chalk.gray('Verbose logging:')} ${config.preferences.verboseLogging ? chalk.green('yes') : chalk.gray('no')}`);
      this.log(`    ${chalk.gray('Preserve sessions:')} ${config.preferences.preserveSessions !== false ? chalk.green('yes') : chalk.gray('no')}`);
    }

    if (config.outputs) {
      this.log(`\n  ${chalk.bold('Outputs:')}`);
      this.log(`    ${chalk.gray('Path:')} ${config.outputs.path || '.devflow/outputs'}`);
      this.log(`    ${chalk.gray('Format:')} ${config.outputs.format || 'markdown'}`);
    }

    this.log('');
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj as unknown);
  }

  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current: Record<string, unknown>, key: string) => {
      if (!current[key]) current[key] = {};
      return current[key] as Record<string, unknown>;
    }, obj);
    target[lastKey] = value;
  }

  private getDefaultConfig(agent: string): DevFlowConfig {
    return {
      version: '1.0.0',
      providers: [agent],
      templates: {
        prdQuestions: 'default',
        fullPrd: 'default',
        quickPrd: 'default',
      },
      outputs: {
        path: '.devflow/outputs',
        format: 'markdown',
      },
      preferences: {
        autoOpenOutputs: false,
        verboseLogging: false,
        preserveSessions: true,
      },
      experimental: {},
    };
  }
}

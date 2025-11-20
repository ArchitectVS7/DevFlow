import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs-extra';
import * as path from 'path';
import { DevFlowConfig } from '../../types/config.js';
import { LlmClient } from '../../core/llm-client.js';
import { GitManager } from '../../core/git-manager.js';

export default class AuditCheck extends Command {
    static description = 'Reflective audit of the codebase using LLM';

    static flags = {
        diff: Flags.boolean({
            description: 'Audit only the latest diff (staged + unstaged)',
            default: false,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(AuditCheck);

        console.log(chalk.bold.cyan('\n🛡️  DevFlow Audit Check\n'));

        // Load config
        const configPath = path.join(process.cwd(), '.devflow', 'config.json');
        if (!fs.existsSync(configPath)) {
            this.error('No .devflow/config.json found. Run "devflow init" first.');
        }
        const config: DevFlowConfig = await fs.readJson(configPath);

        if (!config.audit) {
            this.error('Audit configuration not found in .devflow/config.json. Please configure "audit" section.');
        }

        const llmClient = new LlmClient(config.audit);
        let context = '';
        let prompt = '';

        if (flags.diff) {
            console.log(chalk.dim('Retrieving git diff...'));
            const gitManager = new GitManager();
            context = await gitManager.getDiff();
            if (!context) {
                console.log(chalk.green('No changes to audit.'));
                return;
            }
            prompt = `Review the following git diff for security gaps, architectural anti-patterns, and missing documentation.
If issues are found, list them clearly. 
If no issues are found, explicitly say "No issues found".
Focus on critical issues.

Diff:
${context.substring(0, 15000)}
`; // Limit context size
        } else {
            // Full scan (simplified)
            console.log(chalk.dim('Scanning source files...'));
            // Read src/index.ts and package.json as a sample
            // In a real implementation, we'd use a more sophisticated context gathering
            const packageJson = await fs.readFile('package.json', 'utf-8');
            context = `package.json:\n${packageJson}\n\n`;

            // Add some source files
            // This is a placeholder for a full scan
            prompt = `Review the project configuration (package.json) for security gaps or issues.
      
Context:
${context}
`;
        }

        console.log(chalk.dim('Analyzing with LLM...'));
        try {
            const response = await llmClient.complete(prompt);
            console.log(chalk.bold('\nAudit Results:\n'));
            console.log(response);

            if (response.toLowerCase().includes('no issues found')) {
                console.log(chalk.green('\n✓ Audit passed'));
            } else {
                console.log(chalk.red('\n✗ Issues found'));
                process.exit(1);
            }
        } catch (error) {
            this.error(`Audit failed: ${(error as Error).message}`);
        }
    }
}

import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  PromptOptimizer,
  COSTARResult,
  ImprovedPrompt,
  COSTARScore,
} from '../../core/prompt-optimizer.js';
import { PromptManager } from '../../core/prompt-manager.js';

export default class Fast extends Command {
  static description =
    'Quickly improve a prompt using COSTAR framework (Context, Objective, Style) with smart triage';

  static examples = [
    '<%= config.bin %> <%= command.id %> "Create a login page"',
    '<%= config.bin %> <%= command.id %> "Build an API for user management"',
  ];

  static flags = {
    'costar-only': Flags.boolean({
      description: 'Show only COSTAR analysis without improved prompt',
      default: false,
    }),
    'framework-info': Flags.boolean({
      description: 'Display COSTAR framework information',
      default: false,
    }),
  };

  static args = {
    prompt: Args.string({
      description: 'The prompt to improve',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Fast);

    // Handle --framework-info flag
    if (flags['framework-info']) {
      this.displayFrameworkInfo();
      return;
    }

    if (!args.prompt || args.prompt.trim().length === 0) {
      console.log(chalk.red('\n✗ Please provide a prompt to improve\n'));
      console.log(chalk.gray('Example:'), chalk.cyan('devflow fast "Create a login page"'));
      return;
    }

    console.log(chalk.bold.cyan('\n🔍 Analyzing prompt using COSTAR framework (fast mode)...\n'));

    const optimizer = new PromptOptimizer();

    // Get COSTAR analysis
    const costarResult = optimizer.applyCOSTARFramework(args.prompt, 'fast');
    const costarScore = optimizer.calculateCOSTARScore(costarResult);

    // Also get the full improvement result for triage
    const result = optimizer.improve(args.prompt, 'fast');

    // Check COSTAR-aware triage result (low scores indicate need for deep mode)
    const needsDeepAnalysis =
      result.triageResult?.needsDeepAnalysis ||
      costarScore.context < 60 ||
      costarScore.objective < 60 ||
      costarScore.style < 50;

    if (needsDeepAnalysis) {
      console.log(chalk.bold.yellow('⚠️  COSTAR Framework Triage Alert\n'));
      console.log(chalk.yellow('Deep analysis is recommended for this prompt because:'));

      if (costarScore.context < 60) {
        console.log(
          chalk.yellow(
            `  • Low Context score (${costarScore.context.toFixed(0)}%) - needs richer background information`
          )
        );
      }
      if (costarScore.objective < 60) {
        console.log(
          chalk.yellow(
            `  • Low Objective score (${costarScore.objective.toFixed(0)}%) - goal needs clarification`
          )
        );
      }
      if (costarScore.style < 50) {
        console.log(
          chalk.yellow(
            `  • Low Style score (${costarScore.style.toFixed(0)}%) - output format not well-defined`
          )
        );
      }

      result.triageResult?.reasons.forEach((reason) => {
        console.log(chalk.yellow(`  • ${reason}`));
      });
      console.log();

      const { proceed } = await inquirer.prompt([
        {
          type: 'list',
          name: 'proceed',
          message: 'How would you like to proceed?',
          choices: [
            { name: 'Switch to deep mode (recommended)', value: 'deep' },
            { name: 'Continue with fast mode (at my own risk)', value: 'fast' },
          ],
        },
      ]);

      if (proceed === 'deep') {
        console.log(chalk.cyan('\n🔍 Switching to deep mode...\n'));
        const deepClearResult = optimizer.applyCOSTARFramework(args.prompt, 'deep');
        const deepClearScore = optimizer.calculateCOSTARScore(deepClearResult);
        const deepResult = optimizer.improve(args.prompt, 'deep');
        this.displayDeepModeOutput(deepResult, deepClearResult, deepClearScore);
        return;
      }

      console.log(chalk.yellow('\n⚠️  Proceeding with fast mode as requested\n'));
    }

    // Handle --costar-only flag
    if (flags['costar-only']) {
      this.displayCLEAROnlyAnalysis(costarResult, costarScore);
      return;
    }

    // Display full analysis
    this.displayFastModeOutput(result, costarResult, costarScore);

    // Save prompt to file system
    await this.savePrompt(costarResult.improvedPrompt, args.prompt, costarScore);
  }

  private displayFastModeOutput(
    result: ImprovedPrompt,
    costarResult: COSTARResult,
    costarScore: COSTARScore
  ): void {
    console.log(chalk.bold.cyan('🎯 CLEAR Analysis (Fast Mode)\n'));

    // Display COSTAR Assessment
    console.log(chalk.bold('📊 COSTAR Framework Assessment:\n'));

    const getScoreColor = (score: number) => {
      if (score >= 80) return chalk.green;
      if (score >= 60) return chalk.yellow;
      return chalk.red;
    };

    // Context
    const cColor = getScoreColor(costarScore.context);
    console.log(cColor(`  [C] Context: ${costarScore.context.toFixed(0)}%`));
    if (costarResult.context.issues.length > 0) {
      costarResult.context.issues.forEach((issue: string) => {
        console.log(cColor(`      • ${issue}`));
      });
    }
    console.log();

    // Objective
    const oColor = getScoreColor(costarScore.objective);
    console.log(oColor(`  [O] Objective: ${costarScore.objective.toFixed(0)}%`));
    if (costarResult.objective.issues.length > 0) {
      costarResult.objective.issues.forEach((issue: string) => {
        console.log(oColor(`      • ${issue}`));
      });
    }
    console.log();

    // Style
    const sColor = getScoreColor(costarScore.style);
    console.log(sColor(`  [S] Style: ${costarScore.style.toFixed(0)}%`));
    if (costarResult.style.issues.length > 0) {
      costarResult.style.issues.forEach((issue: string) => {
        console.log(sColor(`      • ${issue}`));
      });
    }
    console.log();

    // Overall score
    const overallColor = getScoreColor(costarScore.overall);
    console.log(
      overallColor.bold(
        `  Overall COSTAR Score: ${costarScore.overall.toFixed(0)}% (${costarScore.rating})\n`
      )
    );

    // Recommendation for deep mode
    console.log(chalk.blue.bold('💡 Recommendation:'));
    console.log(chalk.blue('  For Adaptive variations (A) and Reflective validation (R), use:'));
    console.log(chalk.cyan('  devflow deep "<your prompt>"\n'));

    // Display improved prompt
    console.log(chalk.bold.cyan('✨ COSTAR-Optimized Prompt:\n'));
    console.log(chalk.dim('─'.repeat(80)));
    console.log(costarResult.improvedPrompt);
    console.log(chalk.dim('─'.repeat(80)));
    console.log();

    // Changes made (CLEAR-labeled)
    if (costarResult.changesSummary.length > 0) {
      console.log(chalk.bold.magenta('📝 COSTAR Changes Made:\n'));
      costarResult.changesSummary.forEach((change: { component: string; change: string }) => {
        const label = chalk.bold(`[${change.component}]`);
        console.log(chalk.magenta(`  ${label} ${change.change}`));
      });
      console.log();
    }

    console.log(
      chalk.gray('💡 Tip: Copy the COSTAR-optimized prompt above and use it with your AI agent\n')
    );
  }

  private displayDeepModeOutput(
    result: ImprovedPrompt,
    costarResult: COSTARResult,
    costarScore: COSTARScore
  ): void {
    console.log(chalk.bold.cyan('🎯 COSTAR Framework Deep Analysis\n'));

    // Display COSTAR Assessment (all 5 components for deep mode)
    console.log(chalk.bold('📊 Framework Assessment:\n'));

    const getScoreColor = (score: number) => {
      if (score >= 80) return chalk.green;
      if (score >= 60) return chalk.yellow;
      return chalk.red;
    };

    // C, O, S (core components)
    const cColor = getScoreColor(costarScore.context);
    console.log(cColor(`  [C] Context: ${costarScore.context.toFixed(0)}%`));
    costarResult.context.suggestions.forEach((s: string) => console.log(cColor(`      ${s}`)));
    console.log();

    const oColor = getScoreColor(costarScore.objective);
    console.log(oColor(`  [O] Objective: ${costarScore.objective.toFixed(0)}%`));
    costarResult.objective.suggestions.forEach((s: string) => console.log(oColor(`      ${s}`)));
    console.log();

    const sColor = getScoreColor(costarScore.style);
    console.log(sColor(`  [S] Style: ${costarScore.style.toFixed(0)}%`));
    costarResult.style.suggestions.forEach((s: string) => console.log(sColor(`      ${s}`)));
    console.log();

    // T, A, R (deep mode only)
    if (costarResult.tone) {
      const tColor = getScoreColor(costarScore.tone || 0);
      console.log(tColor(`  [T] Tone: ${(costarScore.tone || 0).toFixed(0)}%`));
      console.log(tColor(`      See "Tone Analysis" section below`));
      console.log();
    }

    if (costarResult.audience) {
      const aColor = getScoreColor(costarScore.audience || 0);
      console.log(aColor(`  [A] Audience: ${(costarScore.audience || 0).toFixed(0)}%`));
      console.log(aColor(`      See "Audience Analysis" section below`));
      console.log();
    }

    if (costarResult.response) {
      const rColor = getScoreColor(costarScore.response || 0);
      console.log(rColor(`  [R] Response: ${(costarScore.response || 0).toFixed(0)}%`));
      console.log(rColor(`      See "Response Format" section below`));
      console.log();
    }

    // Overall
    const overallColor = getScoreColor(costarScore.overall);
    console.log(
      overallColor.bold(
        `  Overall COSTAR Score: ${costarScore.overall.toFixed(0)}% (${costarScore.rating})\n`
      )
    );

    // Display improved prompt
    console.log(chalk.bold.cyan('✨ COSTAR-Optimized Prompt:\n'));
    console.log(chalk.dim('─'.repeat(80)));
    console.log(costarResult.improvedPrompt);
    console.log(chalk.dim('─'.repeat(80)));
    console.log();

    // Changes made
    if (costarResult.changesSummary.length > 0) {
      console.log(chalk.bold.magenta('📝 COSTAR Changes Made:\n'));
      costarResult.changesSummary.forEach((change: { component: string; change: string }) => {
        console.log(chalk.magenta(`  [${change.component}] ${change.change}`));
      });
      console.log();
    }

    // Tone Analysis (T)
    if (costarResult.tone) {
      console.log(chalk.bold.cyan('🎭 Tone Analysis:\n'));

      console.log(
        chalk.cyan(`  Tone Specified: ${costarResult.tone.toneSpecified ? 'Yes' : 'No'}`)
      );
      console.log(
        chalk.cyan(`  Voice Consistency: ${costarResult.tone.voiceConsistency ? 'Yes' : 'No'}`)
      );
      console.log(chalk.cyan(`  Formality: ${costarResult.tone.formalityLevel}`));

      if (costarResult.tone.suggestions.length > 0) {
        console.log(chalk.cyan('  Suggestions:'));
        costarResult.tone.suggestions.forEach((s: string) => {
          console.log(chalk.cyan(`    • ${s}`));
        });
      }
      console.log();
    }

    // Audience Analysis (A)
    if (costarResult.audience) {
      console.log(chalk.bold.magenta('👥 Audience Analysis:\n'));

      console.log(
        chalk.magenta(
          `  Audience Specified: ${costarResult.audience.audienceSpecified ? 'Yes' : 'No'}`
        )
      );
      console.log(
        chalk.magenta(
          `  Skill Level Defined: ${costarResult.audience.skillLevelDefined ? 'Yes' : 'No'}`
        )
      );
      console.log(
        chalk.magenta(`  Needs Addressed: ${costarResult.audience.needsAddressed ? 'Yes' : 'No'}`)
      );

      if (costarResult.audience.suggestions.length > 0) {
        console.log(chalk.magenta('  Suggestions:'));
        costarResult.audience.suggestions.forEach((s: string) => {
          console.log(chalk.magenta(`    • ${s}`));
        });
      }
      console.log();
    }

    // Response Format (R)
    if (costarResult.response) {
      console.log(chalk.bold.yellow('📋 Response Format:\n'));

      console.log(
        chalk.yellow(
          `  Output Format: ${costarResult.response.outputFormatClear ? 'Clear' : 'Unclear'}`
        )
      );
      console.log(
        chalk.yellow(
          `  Deliverables: ${costarResult.response.deliverablesSpecified ? 'Specified' : 'Not specified'}`
        )
      );
      console.log(
        chalk.yellow(
          `  Examples: ${costarResult.response.examplesProvided ? 'Provided' : 'Not provided'}`
        )
      );

      if (costarResult.response.suggestions.length > 0) {
        console.log(chalk.yellow('  Suggestions:'));
        costarResult.response.suggestions.forEach((s: string) => {
          console.log(chalk.yellow(`    • ${s}`));
        });
      }
      console.log();
    }

    console.log(chalk.gray('💡 Full COSTAR framework analysis complete!\n'));
  }

  private displayCLEAROnlyAnalysis(costarResult: COSTARResult, costarScore: COSTARScore): void {
    console.log(chalk.bold.cyan('🎯 COSTAR Framework Analysis Only\n'));

    const getScoreColor = (score: number) => {
      if (score >= 80) return chalk.green;
      if (score >= 60) return chalk.yellow;
      return chalk.red;
    };

    console.log(chalk.bold('📊 COSTAR Assessment:\n'));

    // Context
    const cColor = getScoreColor(costarScore.context);
    console.log(cColor.bold(`  [C] Context: ${costarScore.context.toFixed(0)}%`));
    console.log(cColor(`      Background: ${costarResult.context.hasBackground ? 'Yes' : 'No'}`));
    console.log(cColor(`      Constraints: ${costarResult.context.hasConstraints ? 'Yes' : 'No'}`));
    console.log(cColor(`      Situation Clarity: ${costarResult.context.situationClarity}%`));
    costarResult.context.issues.forEach((issue: string) => {
      console.log(cColor(`      • ${issue}`));
    });
    console.log();

    // Objective
    const oColor = getScoreColor(costarScore.objective);
    console.log(oColor.bold(`  [O] Objective: ${costarScore.objective.toFixed(0)}%`));
    console.log(oColor(`      Goal Clarity: ${costarResult.objective.goalClarity ? 'Yes' : 'No'}`));
    console.log(oColor(`      Measurable: ${costarResult.objective.measurable ? 'Yes' : 'No'}`));
    console.log(oColor(`      Achievable: ${costarResult.objective.achievable ? 'Yes' : 'No'}`));
    costarResult.objective.issues.forEach((issue: string) => {
      console.log(oColor(`      • ${issue}`));
    });
    console.log();

    // Style
    const sColor = getScoreColor(costarScore.style);
    console.log(sColor.bold(`  [S] Style: ${costarScore.style.toFixed(0)}%`));
    console.log(
      sColor(`      Format Specified: ${costarResult.style.formatSpecified ? 'Yes' : 'No'}`)
    );
    console.log(
      sColor(`      Structure Defined: ${costarResult.style.structureDefined ? 'Yes' : 'No'}`)
    );
    console.log(
      sColor(`      Presentation Clear: ${costarResult.style.presentationClear ? 'Yes' : 'No'}`)
    );
    costarResult.style.issues.forEach((issue: string) => {
      console.log(sColor(`      • ${issue}`));
    });
    console.log();

    // Overall
    const overallColor = getScoreColor(costarScore.overall);
    console.log(
      overallColor.bold(
        `  Overall Score: ${costarScore.overall.toFixed(0)}% (${costarScore.rating})\n`
      )
    );

    console.log(chalk.gray('Use without --costar-only flag to see improved prompt and changes.\n'));
  }

  private async savePrompt(
    improvedPrompt: string,
    originalPrompt: string,
    costarScore: COSTARScore
  ): Promise<void> {
    try {
      const promptManager = new PromptManager();

      // Build content with COSTAR scores
      const content = `# Improved Prompt

${improvedPrompt}

## COSTAR Scores
- **C** (Context): ${costarScore.context.toFixed(0)}%
- **O** (Objective): ${costarScore.objective.toFixed(0)}%
- **S** (Style): ${costarScore.style.toFixed(0)}%
- **Overall**: ${costarScore.overall.toFixed(0)}% (${costarScore.rating})

## Original Prompt
\`\`\`
${originalPrompt}
\`\`\`
`;

      const metadata = await promptManager.savePrompt(content, 'fast', originalPrompt);

      console.log(chalk.green(`\n✅ Prompt saved to: ${metadata.filename}`));
      console.log(chalk.cyan(`\n💡 Next steps:`));
      console.log(chalk.cyan(`   /devflow:execute    - Implement this prompt`));
      console.log(chalk.cyan(`   /devflow:prompts    - Review all saved prompts`));
      console.log();
    } catch (error) {
      // Don't fail the command if saving fails
      console.log(chalk.yellow(`\n⚠️  Could not save prompt: ${error}`));
    }
  }

  private displayFrameworkInfo(): void {
    console.log(chalk.bold.cyan('\n🎯 COSTAR Framework for Prompt Engineering\n'));

    console.log(chalk.bold('What is COSTAR?\n'));
    console.log('COSTAR is a framework framework for creating effective prompts:');
    console.log();

    console.log(chalk.green.bold('  [C] Context'));
    console.log(chalk.green('      Background, situation, and constraints'));
    console.log(chalk.green('      Provide relevant context for the task'));
    console.log(chalk.green('      Example: "Please could you maybe help" → "Create"'));
    console.log();

    console.log(chalk.blue.bold('  [O] Objective'));
    console.log(chalk.blue('      Clear goal and desired outcome'));
    console.log(chalk.blue('      Structure: Context → Requirements → Constraints → Output'));
    console.log(chalk.blue('      Example: Put background before asking for results'));
    console.log();

    console.log(chalk.yellow.bold('  [S] Style'));
    console.log(chalk.yellow('      Format, structure, and presentation'));
    console.log(chalk.yellow('      Define exactly what you want'));
    console.log(
      chalk.yellow(
        '      Example: "Build a dashboard" → "Build a React analytics dashboard with charts"'
      )
    );
    console.log();

    console.log(chalk.magenta.bold('  [T] Tone (Deep Mode Only)'));
    console.log(chalk.magenta('      Voice and formality level'));
    console.log(chalk.magenta('      Flexibility and customization'));
    console.log(chalk.magenta('      Example: User story, job story, or structured formats'));
    console.log();

    console.log(chalk.cyan.bold('  [A] Audience (Deep Mode Only)'));
    console.log(chalk.cyan('      Target users and skill level'));
    console.log(chalk.cyan('      Edge cases and "what could go wrong"'));
    console.log(chalk.cyan('      Example: Fact-checking steps, success criteria validation'));
    console.log();

    console.log(chalk.bold('Academic Foundation:\n'));
    console.log('  Based on COSTAR framework');
    console.log('  Optimized for AI prompt engineering');
    console.log();

    console.log(chalk.bold('Resources:\n'));
    console.log();

    console.log(chalk.bold('Usage in DevFlow:\n'));
    console.log(
      chalk.cyan('  devflow fast "prompt"') + chalk.gray('     # Uses C, O, S components')
    );
    console.log(
      chalk.cyan('  devflow deep "prompt"') +
        chalk.gray('     # Uses full COSTAR (C, O, S, T, A, R)')
    );
    console.log(
      chalk.cyan('  devflow fast --costar-only') + chalk.gray(' # Show scores only, no improvement')
    );
    console.log();
  }
}

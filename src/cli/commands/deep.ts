import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import {
  PromptOptimizer,
  COSTARResult,
  ImprovedPrompt,
  COSTARScore,
} from '../../core/prompt-optimizer.js';
import { PromptManager } from '../../core/prompt-manager.js';

export default class Deep extends Command {
  static description =
    'Perform comprehensive deep analysis using full COSTAR framework (Context, Objective, Style, Adaptive, Reflective)';

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
      description: 'The prompt to analyze deeply',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Deep);

    // Handle --framework-info flag
    if (flags['framework-info']) {
      this.displayFrameworkInfo();
      return;
    }

    if (!args.prompt || args.prompt.trim().length === 0) {
      console.log(chalk.red('\n✗ Please provide a prompt to analyze\n'));
      console.log(chalk.gray('Example:'), chalk.cyan('devflow deep "Create a login page"'));
      return;
    }

    console.log(chalk.bold.cyan('\n🔍 Performing deep analysis using full COSTAR framework...\n'));

    const optimizer = new PromptOptimizer();

    // Get COSTAR analysis (deep mode - all 5 components)
    const costarResult = optimizer.applyCOSTARFramework(args.prompt, 'deep');
    const costarScore = optimizer.calculateCOSTARScore(costarResult);

    // Also get the full improvement result for backward compatibility
    const result = optimizer.improve(args.prompt, 'deep');

    // Handle --costar-only flag
    if (flags['costar-only']) {
      this.displayCLEAROnlyAnalysis(costarResult, costarScore);
      return;
    }

    this.displayOutput(result, costarResult, costarScore);

    // Save prompt to file system
    await this.savePrompt(costarResult.improvedPrompt, args.prompt, costarScore);
  }

  private displayOutput(
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
    console.log(cColor.bold(`  [C] Context: ${costarScore.context.toFixed(0)}%`));
    if (costarResult.context.suggestions.length > 0) {
      costarResult.context.suggestions
        .slice(0, 2)
        .forEach((s: string) => console.log(cColor(`      ${s}`)));
    }
    console.log();

    const oColor = getScoreColor(costarScore.objective);
    console.log(oColor.bold(`  [O] Objective: ${costarScore.objective.toFixed(0)}%`));
    if (costarResult.objective.suggestions.length > 0) {
      costarResult.objective.suggestions
        .slice(0, 2)
        .forEach((s: string) => console.log(oColor(`      ${s}`)));
    }
    console.log();

    const sColor = getScoreColor(costarScore.style);
    console.log(sColor.bold(`  [S] Style: ${costarScore.style.toFixed(0)}%`));
    if (costarResult.style.suggestions.length > 0) {
      costarResult.style.suggestions
        .slice(0, 2)
        .forEach((s: string) => console.log(sColor(`      ${s}`)));
    }
    console.log();

    // T, A, R (deep mode only)
    if (costarResult.tone) {
      const tColor = getScoreColor(costarScore.tone || 0);
      console.log(tColor.bold(`  [T] Tone: ${(costarScore.tone || 0).toFixed(0)}%`));
      console.log(tColor(`      See "Tone Analysis" section below`));
      console.log();
    }

    if (costarResult.audience) {
      const aColor = getScoreColor(costarScore.audience || 0);
      console.log(aColor.bold(`  [A] Audience: ${(costarScore.audience || 0).toFixed(0)}%`));
      console.log(aColor(`      See "Audience Analysis" section below`));
      console.log();
    }

    if (costarResult.response) {
      const rColor = getScoreColor(costarScore.response || 0);
      console.log(rColor.bold(`  [R] Response: ${(costarScore.response || 0).toFixed(0)}%`));
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

    console.log(chalk.gray('💡 Full COSTAR framework analysis complete (C, O, S, T, A, R)!\n'));
  }

  private displayCLEAROnlyAnalysis(costarResult: COSTARResult, costarScore: COSTARScore): void {
    console.log(chalk.bold.cyan('🎯 COSTAR Framework Analysis Only (Deep Mode)\n'));

    const getScoreColor = (score: number) => {
      if (score >= 80) return chalk.green;
      if (score >= 60) return chalk.yellow;
      return chalk.red;
    };

    console.log(chalk.bold('📊 Complete COSTAR Assessment:\n'));

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

    // Tone
    if (costarResult.tone) {
      const tColor = getScoreColor(costarScore.tone || 0);
      console.log(tColor.bold(`  [T] Tone: ${(costarScore.tone || 0).toFixed(0)}%`));
      console.log(
        tColor(`      Tone Specified: ${costarResult.tone.toneSpecified ? 'Yes' : 'No'}`)
      );
      console.log(
        tColor(`      Voice Consistency: ${costarResult.tone.voiceConsistency ? 'Yes' : 'No'}`)
      );
      console.log(tColor(`      Formality: ${costarResult.tone.formalityLevel}`));
      costarResult.tone.issues.forEach((issue: string) => {
        console.log(tColor(`      • ${issue}`));
      });
      console.log();
    }

    // Audience
    if (costarResult.audience) {
      const aColor = getScoreColor(costarScore.audience || 0);
      console.log(aColor.bold(`  [A] Audience: ${(costarScore.audience || 0).toFixed(0)}%`));
      console.log(
        aColor(
          `      Audience Specified: ${costarResult.audience.audienceSpecified ? 'Yes' : 'No'}`
        )
      );
      console.log(
        aColor(
          `      Skill Level Defined: ${costarResult.audience.skillLevelDefined ? 'Yes' : 'No'}`
        )
      );
      console.log(
        aColor(`      Needs Addressed: ${costarResult.audience.needsAddressed ? 'Yes' : 'No'}`)
      );
      costarResult.audience.issues.forEach((issue: string) => {
        console.log(aColor(`      • ${issue}`));
      });
      console.log();
    }

    // Response
    if (costarResult.response) {
      const rColor = getScoreColor(costarScore.response || 0);
      console.log(rColor.bold(`  [R] Response: ${(costarScore.response || 0).toFixed(0)}%`));
      console.log(
        rColor(
          `      Output Format: ${costarResult.response.outputFormatClear ? 'Clear' : 'Unclear'}`
        )
      );
      console.log(
        rColor(
          `      Deliverables: ${costarResult.response.deliverablesSpecified ? 'Specified' : 'Not specified'}`
        )
      );
      console.log(
        rColor(
          `      Examples: ${costarResult.response.examplesProvided ? 'Provided' : 'Not provided'}`
        )
      );
      costarResult.response.issues.forEach((issue: string) => {
        console.log(rColor(`      • ${issue}`));
      });
      console.log();
    }

    // Overall
    const overallColor = getScoreColor(costarScore.overall);
    console.log(
      overallColor.bold(
        `  Overall Score: ${costarScore.overall.toFixed(0)}% (${costarScore.rating})\n`
      )
    );

    console.log(
      chalk.gray('Use without --costar-only flag to see improved prompt and detailed sections.\n')
    );
  }

  private async savePrompt(
    improvedPrompt: string,
    originalPrompt: string,
    costarScore: COSTARScore
  ): Promise<void> {
    try {
      const promptManager = new PromptManager();

      // Build content with full COSTAR scores (including T, A, R)
      const content = `# Improved Prompt

${improvedPrompt}

## COSTAR Scores (Deep Analysis)
- **C** (Context): ${costarScore.context.toFixed(0)}%
- **O** (Objective): ${costarScore.objective.toFixed(0)}%
- **S** (Style): ${costarScore.style.toFixed(0)}%
- **T** (Tone): ${(costarScore.tone || 0).toFixed(0)}%
- **A** (Audience): ${(costarScore.audience || 0).toFixed(0)}%
- **R** (Response): ${(costarScore.response || 0).toFixed(0)}%
- **Overall**: ${costarScore.overall.toFixed(0)}% (${costarScore.rating})

## Original Prompt
\`\`\`
${originalPrompt}
\`\`\`
`;

      const metadata = await promptManager.savePrompt(content, 'deep', originalPrompt);

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

    console.log(chalk.bold('What is CLEAR?\n'));
    console.log('CLEAR is an academically-validated framework for creating effective prompts:');
    console.log();

    console.log(chalk.green.bold('  [C] Context'));
    console.log(chalk.green('      Eliminate verbosity and pleasantries'));
    console.log(chalk.green('      Focus on essential information'));
    console.log(chalk.green('      Example: "Please could you maybe help" → "Create"'));
    console.log();

    console.log(chalk.blue.bold('  [O] Objective'));
    console.log(chalk.blue('      Ensure coherent sequencing'));
    console.log(chalk.blue('      Structure: Context → Requirements → Constraints → Output'));
    console.log(chalk.blue('      Example: Put background before asking for results'));
    console.log();

    console.log(chalk.yellow.bold('  [S] Style'));
    console.log(chalk.yellow('      Specify persona, format, tone, and success criteria'));
    console.log(chalk.yellow('      Define exactly what you want'));
    console.log(
      chalk.yellow(
        '      Example: "Build a dashboard" → "Build a React analytics dashboard with charts"'
      )
    );
    console.log();

    console.log(chalk.magenta.bold('  [T] Tone'));
    console.log(chalk.magenta('      Provide alternative approaches'));
    console.log(chalk.magenta('      Flexibility and customization'));
    console.log(chalk.magenta('      Example: User story, job story, or structured formats'));
    console.log();

    console.log(chalk.cyan.bold('  [A] Audience'));
    console.log(chalk.cyan('      Enable validation and quality checks'));
    console.log(chalk.cyan('      Edge cases and "what could go wrong"'));
    console.log(chalk.cyan('      Example: Fact-checking steps, success criteria validation'));
    console.log();

    console.log(chalk.bold('Academic Foundation:\n'));
    console.log('  Developed by: Dr. Leo Lo');
    console.log('  Institution: Dean of Libraries, University of New Mexico');
    console.log('  Published: Journal of Academic Librarianship, July 2023');
    console.log('  Paper: "The CLEAR Path: A Framework for Enhancing Information');
    console.log('         Literacy through Prompt Engineering"');
    console.log();

    console.log(chalk.bold('Resources:\n'));
    console.log('  • Framework Guide: https://guides.library.tamucc.edu/prompt-engineering/clear');
    console.log(
      '  • Research Paper: https://digitalrepository.unm.edu/cgi/viewcontent.cgi?article=1214&context=ulls_fsp'
    );
    console.log();

    console.log(chalk.bold('Usage in DevFlow:\n'));
    console.log(
      chalk.cyan('  devflow fast "prompt"') + chalk.gray('     # Uses C, L, E components')
    );
    console.log(
      chalk.cyan('  devflow deep "prompt"') + chalk.gray('     # Uses full CLEAR (C, L, E, A, R)')
    );
    console.log(
      chalk.cyan('  devflow deep --costar-only') + chalk.gray(' # Show scores only, no improvement')
    );
    console.log();
  }
}

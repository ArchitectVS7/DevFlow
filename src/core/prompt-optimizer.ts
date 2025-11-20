/**
 * PromptOptimizer - Analyzes and improves prompts using the CLEAR Framework
 * CLEAR Framework: Concise, Logical, Explicit, Adaptive, Reflective
 * Developed by Dr. Leo Lo, University of New Mexico
 * Reference: https://guides.library.tamucc.edu/prompt-engineering/clear
 */

export type OptimizerMode = 'fast' | 'deep';

export interface PromptAnalysis {
  gaps: string[];
  ambiguities: string[];
  strengths: string[];
  suggestions: string[];
}

// CLEAR Framework Interfaces
export interface ConciseAnalysis {
  score: number; // 0-100
  verbosityCount: number;
  pleasantriesCount: number;
  signalToNoiseRatio: number;
  issues: string[];
  suggestions: string[];
}

export interface LogicAnalysis {
  score: number; // 0-100
  hasCoherentFlow: boolean;
  sequencingIssues: string[];
  suggestedOrder: string[];
  issues: string[];
  suggestions: string[];
}

export interface ExplicitAnalysis {
  score: number; // 0-100
  hasPersona: boolean;
  hasOutputFormat: boolean;
  hasToneStyle: boolean;
  hasSuccessCriteria: boolean;
  hasExamples: boolean;
  issues: string[];
  suggestions: string[];
}

export interface AdaptiveAnalysis {
  score: number; // 0-100
  alternativePhrasings: string[];
  alternativeStructures: Array<{
    name: string;
    structure: string;
    benefits: string;
  }>;
  temperatureRecommendation: number;
  issues: string[];
  suggestions: string[];
}

export interface ReflectiveAnalysis {
  score: number; // 0-100
  validationChecklist: string[];
  edgeCases: string[];
  potentialIssues: string[];
  factCheckingSteps: string[];
  qualityCriteria: string[];
  issues: string[];
  suggestions: string[];
}

export interface CLEARResult {
  conciseness: ConciseAnalysis;
  logic: LogicAnalysis;
  explicitness: ExplicitAnalysis;
  adaptiveness?: AdaptiveAnalysis; // Only in deep mode
  reflectiveness?: ReflectiveAnalysis; // Only in deep mode
  overallScore: number;
  improvedPrompt: string;
  changesSummary: Array<{
    component: 'C' | 'L' | 'E' | 'A' | 'R';
    change: string;
  }>;
}

export interface CLEARScore {
  overall: number;
  conciseness: number;
  logic: number;
  explicitness: number;
  adaptiveness?: number;
  reflectiveness?: number;
  rating: 'excellent' | 'good' | 'needs-improvement' | 'poor';
}

export interface TriageResult {
  needsDeepAnalysis: boolean;
  reasons: string[];
}

export interface QualityAssessment {
  isAlreadyGood: boolean;
  criteriaMetCount: number;
  totalCriteria: number;
  criteriaResults: {
    clearGoal: boolean;
    sufficientContext: boolean;
    actionableLanguage: boolean;
    reasonableScope: boolean;
  };
}

export interface ChangesSummary {
  changes: string[];
}

export interface ImprovedPrompt {
  original: string;
  analysis: PromptAnalysis;
  improved: string;
  changesSummary?: ChangesSummary;
  triageResult?: TriageResult;
  qualityAssessment?: QualityAssessment;
  alternativePhrasings?: string[];
  edgeCases?: string[];
  implementationExamples?: {
    good: string[];
    bad: string[];
  };
  alternativeStructures?: Array<{
    structure: string;
    benefits: string;
  }>;
  potentialIssues?: string[];
}

export class PromptOptimizer {
  /**
   * Analyze a prompt and identify issues
   */
  analyze(prompt: string): PromptAnalysis {
    return {
      gaps: this.findGaps(prompt),
      ambiguities: this.findAmbiguities(prompt),
      strengths: this.findStrengths(prompt),
      suggestions: this.generateSuggestions(prompt),
    };
  }

  /**
   * Perform smart triage to determine if deep analysis is recommended
   */
  performTriage(prompt: string): TriageResult {
    const reasons: string[] = [];

    // Check 1: Short prompts (< 20 characters)
    if (prompt.trim().length < 20) {
      reasons.push('Prompt is very short (< 20 characters)');
    }

    // Check 2: Missing critical elements
    const criticalElements = this.countMissingCriticalElements(prompt);
    if (criticalElements >= 3) {
      reasons.push(`Missing ${criticalElements} critical elements (context, tech stack, success criteria, user needs, expected output)`);
    }

    // Check 3: Vague scope words without context
    if (this.hasVagueScopeWithoutContext(prompt)) {
      reasons.push('Contains vague scope words ("app", "system", "project") without sufficient context');
    }

    return {
      needsDeepAnalysis: reasons.length > 0,
      reasons,
    };
  }

  /**
   * Assess prompt quality
   */
  assessQuality(prompt: string): QualityAssessment {
    const criteria = {
      clearGoal: this.hasClearGoal(prompt),
      sufficientContext: this.hasContext(prompt),
      actionableLanguage: this.hasActionableLanguage(prompt),
      reasonableScope: this.hasReasonableScope(prompt),
    };

    const metCount = Object.values(criteria).filter(Boolean).length;
    const total = Object.keys(criteria).length;

    return {
      isAlreadyGood: metCount >= 3,
      criteriaMetCount: metCount,
      totalCriteria: total,
      criteriaResults: criteria,
    };
  }

  /**
   * Generate an improved version of the prompt
   */
  improve(prompt: string, mode: OptimizerMode = 'fast'): ImprovedPrompt {
    const analysis = this.analyze(prompt);
    const improved = this.generateImprovedPrompt(prompt, analysis);
    const changesSummary = this.generateChangesSummary(prompt, improved);
    const triageResult = mode === 'fast' ? this.performTriage(prompt) : undefined;
    const qualityAssessment = this.assessQuality(prompt);

    const result: ImprovedPrompt = {
      original: prompt,
      analysis,
      improved,
      changesSummary,
      triageResult,
      qualityAssessment,
    };

    // Add deep mode features
    if (mode === 'deep') {
      result.alternativePhrasings = this.generateAlternativePhrasings(prompt);
      result.edgeCases = this.identifyEdgeCases(prompt);
      result.implementationExamples = this.generateImplementationExamples(prompt);
      result.alternativeStructures = this.suggestAlternativeStructures(prompt);
      result.potentialIssues = this.identifyPotentialIssues(prompt);
    }

    return result;
  }

  /**
   * Apply CLEAR Framework analysis to a prompt
   * C = Concise, L = Logical, E = Explicit, A = Adaptive (deep only), R = Reflective (deep only)
   */
  applyCLEARFramework(prompt: string, mode: OptimizerMode = 'fast'): CLEARResult {
    // Analyze all components
    const conciseness = this.analyzeConciseness(prompt);
    const logic = this.analyzeLogic(prompt);
    const explicitness = this.analyzeExplicitness(prompt);

    let adaptiveness: AdaptiveAnalysis | undefined;
    let reflectiveness: ReflectiveAnalysis | undefined;

    if (mode === 'deep') {
      adaptiveness = this.analyzeAdaptiveness(prompt);
      reflectiveness = this.analyzeReflectiveness(prompt);
    }

    // Generate improved prompt based on CLEAR analysis
    const improvedPrompt = this.generateCLEARImprovedPrompt(prompt, {
      conciseness,
      logic,
      explicitness,
      adaptiveness,
      reflectiveness,
    });

    // Generate changes summary with CLEAR labels
    const changesSummary = this.generateCLEARChangesSummary(prompt, improvedPrompt, {
      conciseness,
      logic,
      explicitness,
      adaptiveness,
      reflectiveness,
    });

    // Calculate overall score
    const overallScore = this.calculateCLEARScore({
      conciseness,
      logic,
      explicitness,
      adaptiveness,
      reflectiveness,
    }).overall;

    return {
      conciseness,
      logic,
      explicitness,
      adaptiveness,
      reflectiveness,
      overallScore,
      improvedPrompt,
      changesSummary,
    };
  }

  /**
   * Analyze Conciseness (C): Brevity and clarity
   */
  analyzeConciseness(prompt: string): ConciseAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Count pleasantries
    const pleasantries = [
      'please',
      'could you',
      'would you',
      'if possible',
      'maybe',
      'perhaps',
      'kindly',
      'thank you',
    ];
    let pleasantriesCount = 0;
    pleasantries.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = prompt.match(regex);
      if (matches) {
        pleasantriesCount += matches.length;
      }
    });

    if (pleasantriesCount > 0) {
      issues.push(`Contains ${pleasantriesCount} unnecessary pleasantries`);
      suggestions.push('[C] Remove pleasantries - be direct and concise');
    }

    // Count verbose language
    const verbosePatterns = [
      /in order to/gi,
      /due to the fact that/gi,
      /at this point in time/gi,
      /for the purpose of/gi,
      /in the event that/gi,
    ];
    let verbosityCount = 0;
    verbosePatterns.forEach((pattern) => {
      const matches = prompt.match(pattern);
      if (matches) {
        verbosityCount += matches.length;
      }
    });

    if (verbosityCount > 0) {
      issues.push(`Contains ${verbosityCount} verbose phrases`);
      suggestions.push('[C] Replace verbose phrases with concise alternatives');
    }

    // Calculate signal-to-noise ratio
    const wordCount = prompt.split(/\s+/).length;
    const noiseWords = pleasantriesCount + verbosityCount;
    const signalToNoiseRatio = wordCount > 0 ? (wordCount - noiseWords) / wordCount : 0;

    // Calculate score
    let score = 100;
    score -= pleasantriesCount * 5; // -5 points per pleasantry
    score -= verbosityCount * 10; // -10 points per verbose phrase

    if (wordCount > 200 && !this.hasContext(prompt)) {
      issues.push('Long prompt without clear structure');
      suggestions.push('[C] Break into sections for clarity');
      score -= 10;
    }

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      verbosityCount,
      pleasantriesCount,
      signalToNoiseRatio,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Logic (L): Structured and coherent prompts
   */
  analyzeLogic(prompt: string): LogicAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const sequencingIssues: string[] = [];

    // Check for coherent flow - ideal sequence: context → requirements → constraints → output
    const hasContextFirst = this.hasContext(prompt.substring(0, prompt.length / 2));
    const hasOutputLast = this.hasExpectedOutput(prompt.substring(prompt.length / 2));

    let hasCoherentFlow = true;

    // Check if success criteria comes before requirements
    const successMatch = prompt.match(/\b(success|complete|done|measure)/i);
    const requirementMatch = prompt.match(/\b(require|need|must|should have)/i);

    if (successMatch && requirementMatch) {
      const successIndex = successMatch.index || 0;
      const requirementIndex = requirementMatch.index || 0;

      if (successIndex < requirementIndex && successIndex < prompt.length / 3) {
        sequencingIssues.push('Success criteria appears before requirements');
        hasCoherentFlow = false;
      }
    }

    if (!hasContextFirst && this.hasContext(prompt)) {
      sequencingIssues.push('Context appears late in prompt - should be at the beginning');
      hasCoherentFlow = false;
    }

    if (!hasOutputLast && this.hasExpectedOutput(prompt)) {
      sequencingIssues.push('Expected output appears early - should be near the end');
      hasCoherentFlow = false;
    }

    // Suggest optimal order
    const suggestedOrder = [
      '1. Context/Background (what exists now)',
      '2. Objective (what you want to achieve)',
      '3. Requirements (specific needs)',
      '4. Technical Constraints',
      '5. Expected Output',
      '6. Success Criteria',
    ];

    if (!hasCoherentFlow) {
      issues.push('Logical flow could be improved');
      suggestions.push('[L] Restructure prompt following optimal sequence');
    }

    // Check for scattered information
    const lines = prompt.split(/\n/).filter((l) => l.trim());
    if (lines.length > 5 && lines.length < 3) {
      issues.push('Information appears scattered');
      suggestions.push('[L] Group related concepts together');
    }

    // Calculate score
    let score = 100;
    score -= sequencingIssues.length * 15; // -15 points per sequencing issue
    if (!hasCoherentFlow) score -= 20;

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      hasCoherentFlow,
      sequencingIssues,
      suggestedOrder,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Explicitness (E): Clear output specifications
   */
  analyzeExplicitness(prompt: string): ExplicitAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for persona/role
    const hasPersona =
      /\b(as a|role|persona|you are|act as|expert|developer|designer|engineer)\b/i.test(prompt);

    if (!hasPersona) {
      issues.push('No persona or role specified');
      suggestions.push('[E] Specify who should respond (e.g., "As a senior developer...")');
    }

    // Check for output format
    const hasOutputFormat =
      /\b(format|structure|markdown|json|code|list|table|bullet|numbered)\b/i.test(prompt) ||
      this.hasExpectedOutput(prompt);

    if (!hasOutputFormat) {
      issues.push('Output format not specified');
      suggestions.push('[E] Define expected format (e.g., "Provide as a numbered list...")');
    }

    // Check for tone/style
    const hasToneStyle =
      /\b(tone|style|formal|casual|professional|concise|detailed|technical)\b/i.test(prompt);

    if (!hasToneStyle) {
      issues.push('Tone or style not specified');
      suggestions.push('[E] Specify desired tone (e.g., "Use professional tone...")');
    }

    // Check for success criteria
    const hasSuccessCriteria = this.hasSuccessCriteria(prompt);

    if (!hasSuccessCriteria) {
      issues.push('Success criteria not defined');
      suggestions.push('[E] Add measurable success criteria');
    }

    // Check for examples
    const hasExamples = /\b(example|such as|like|e\.g\.|for instance)\b/i.test(prompt);

    if (!hasExamples && prompt.length < 100) {
      suggestions.push('[E] Consider adding examples for clarity');
    }

    // Calculate score based on what's present
    let score = 0;
    if (hasPersona) score += 20;
    if (hasOutputFormat) score += 30;
    if (hasToneStyle) score += 20;
    if (hasSuccessCriteria) score += 20;
    if (hasExamples) score += 10;

    return {
      score,
      hasPersona,
      hasOutputFormat,
      hasToneStyle,
      hasSuccessCriteria,
      hasExamples,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Adaptiveness (A): Flexibility and customization
   */
  analyzeAdaptiveness(prompt: string): AdaptiveAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Generate alternative phrasings
    const alternativePhrasings = this.generateAlternativePhrasings(prompt);

    // Generate alternative structures
    const alternativeStructures = this.suggestAlternativeStructures(prompt).map((s) => ({
      name: s.structure.split(':')[0],
      structure: s.structure,
      benefits: s.benefits,
    }));

    // Recommend temperature based on prompt type
    let temperatureRecommendation = 0.7; // default

    if (/creative|brainstorm|ideas|innovate/i.test(prompt)) {
      temperatureRecommendation = 0.9;
      suggestions.push('[A] Use higher temperature (0.8-0.9) for creative tasks');
    } else if (/code|technical|precise|exact/i.test(prompt)) {
      temperatureRecommendation = 0.3;
      suggestions.push('[A] Use lower temperature (0.2-0.4) for precise technical tasks');
    }

    // Check if prompt is too rigid
    if (
      /\b(must|only|exactly|precisely|never|always)\b/gi.test(prompt) &&
      prompt.match(/\b(must|only|exactly|precisely|never|always)\b/gi)!.length > 3
    ) {
      issues.push('Prompt may be too rigid - limits creative solutions');
      suggestions.push('[A] Consider allowing alternative approaches where appropriate');
    }

    // Calculate score based on flexibility
    let score = 60; // base score

    if (alternativePhrasings.length >= 3) score += 20;
    if (/\b(or|alternative|option|variation)\b/i.test(prompt)) score += 10;
    if (temperatureRecommendation > 0.5 && temperatureRecommendation < 0.9) score += 10;

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      alternativePhrasings,
      alternativeStructures,
      temperatureRecommendation,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Reflectiveness (R): Continuous evaluation and improvement
   */
  analyzeReflectiveness(prompt: string): ReflectiveAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Create validation checklist
    const validationChecklist = [
      'Verify all requirements are clearly stated',
      'Check that success criteria are measurable',
      'Ensure technical constraints are realistic',
      'Validate that the scope is achievable',
    ];

    // Identify edge cases
    const edgeCases = this.identifyEdgeCases(prompt);

    // Identify potential issues
    const potentialIssues = this.identifyPotentialIssues(prompt);

    // Fact-checking steps
    const factCheckingSteps = [
      'Verify AI output matches specified requirements',
      'Cross-reference technical details with documentation',
      'Validate examples and code snippets for accuracy',
      'Check for logical consistency in the response',
    ];

    // Quality criteria
    const qualityCriteria = [
      'Response addresses all stated requirements',
      'Output follows specified format and structure',
      'Technical details are accurate and current',
      'Edge cases are properly handled',
    ];

    if (edgeCases.length === 0) {
      suggestions.push('[R] Add specific edge cases to consider');
    }

    if (!this.hasSuccessCriteria(prompt)) {
      issues.push('No validation criteria provided');
      suggestions.push('[R] Define how to validate the AI output');
    }

    // Calculate score
    let score = 70; // base score

    if (edgeCases.length > 2) score += 10;
    if (this.hasSuccessCriteria(prompt)) score += 20;
    if (potentialIssues.length < 3) score += 10; // fewer issues = better quality

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      validationChecklist,
      edgeCases,
      potentialIssues,
      factCheckingSteps,
      qualityCriteria,
      issues,
      suggestions,
    };
  }

  /**
   * Calculate overall CLEAR score with weighted components
   */
  calculateCLEARScore(analysis: {
    conciseness: ConciseAnalysis;
    logic: LogicAnalysis;
    explicitness: ExplicitAnalysis;
    adaptiveness?: AdaptiveAnalysis;
    reflectiveness?: ReflectiveAnalysis;
  }): CLEARScore {
    const { conciseness, logic, explicitness, adaptiveness, reflectiveness } = analysis;

    let overall: number;
    let rating: 'excellent' | 'good' | 'needs-improvement' | 'poor';

    if (adaptiveness && reflectiveness) {
      // Deep mode: weight all 5 components
      overall =
        conciseness.score * 0.2 +
        logic.score * 0.2 +
        explicitness.score * 0.3 +
        adaptiveness.score * 0.15 +
        reflectiveness.score * 0.15;
    } else {
      // Fast mode: weight only C, L, E
      overall = conciseness.score * 0.25 + logic.score * 0.25 + explicitness.score * 0.5;
    }

    // Determine rating
    if (overall >= 80) rating = 'excellent';
    else if (overall >= 60) rating = 'good';
    else if (overall >= 40) rating = 'needs-improvement';
    else rating = 'poor';

    return {
      overall: Math.round(overall),
      conciseness: conciseness.score,
      logic: logic.score,
      explicitness: explicitness.score,
      adaptiveness: adaptiveness?.score,
      reflectiveness: reflectiveness?.score,
      rating,
    };
  }

  /**
   * Generate improved prompt using CLEAR framework insights
   */
  private generateCLEARImprovedPrompt(
    original: string,
    analysis: {
      conciseness: ConciseAnalysis;
      logic: LogicAnalysis;
      explicitness: ExplicitAnalysis;
      adaptiveness?: AdaptiveAnalysis;
      reflectiveness?: ReflectiveAnalysis;
    }
  ): string {
    let improved = '';

    // Apply Conciseness: Remove fluff
    let cleaned = original;
    const pleasantries = ['please', 'could you', 'would you', 'if possible', 'maybe', 'perhaps', 'kindly'];
    pleasantries.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b\\s*`, 'gi');
      cleaned = cleaned.replace(regex, '');
    });

    // Apply Explicitness: Add missing elements
    if (!analysis.explicitness.hasPersona) {
      improved += '**Role:** Act as an expert developer.\n\n';
    }

    // Apply Logic: Structure the prompt
    improved += '# Objective\n\n';
    improved += this.extractOrInferObjective(cleaned) + '\n\n';

    improved += '# Requirements\n\n';
    improved += this.extractOrInferRequirements(cleaned) + '\n\n';

    improved += '# Technical Constraints\n\n';
    improved += this.extractOrInferTechnical(cleaned) + '\n\n';

    improved += '# Expected Output\n\n';
    improved += this.extractOrInferOutput(cleaned) + '\n\n';

    // Apply Explicitness: Add format specification
    if (!analysis.explicitness.hasOutputFormat) {
      improved += '**Format:** Provide response as a structured, well-organized output.\n\n';
    }

    improved += '# Success Criteria\n\n';
    improved += this.extractOrInferSuccess(cleaned) + '\n';

    return improved.trim();
  }

  /**
   * Generate CLEAR-labeled changes summary
   */
  private generateCLEARChangesSummary(
    original: string,
    improved: string,
    analysis: {
      conciseness: ConciseAnalysis;
      logic: LogicAnalysis;
      explicitness: ExplicitAnalysis;
      adaptiveness?: AdaptiveAnalysis;
      reflectiveness?: ReflectiveAnalysis;
    }
  ): Array<{ component: 'C' | 'L' | 'E' | 'A' | 'R'; change: string }> {
    const changes: Array<{ component: 'C' | 'L' | 'E' | 'A' | 'R'; change: string }> = [];

    // Conciseness changes
    if (analysis.conciseness.pleasantriesCount > 0) {
      changes.push({
        component: 'C',
        change: `Removed ${analysis.conciseness.pleasantriesCount} unnecessary pleasantries`,
      });
    }
    if (analysis.conciseness.verbosityCount > 0) {
      changes.push({
        component: 'C',
        change: `Eliminated ${analysis.conciseness.verbosityCount} verbose phrases`,
      });
    }

    // Logic changes
    if (!analysis.logic.hasCoherentFlow) {
      changes.push({
        component: 'L',
        change: 'Restructured for logical flow: Context → Requirements → Constraints → Output',
      });
    }

    // Explicitness changes
    if (!analysis.explicitness.hasPersona) {
      changes.push({
        component: 'E',
        change: 'Added explicit persona/role specification',
      });
    }
    if (!analysis.explicitness.hasOutputFormat) {
      changes.push({
        component: 'E',
        change: 'Defined output format and structure',
      });
    }
    if (!analysis.explicitness.hasSuccessCriteria && !this.hasSuccessCriteria(original)) {
      changes.push({
        component: 'E',
        change: 'Added measurable success criteria',
      });
    }

    // Adaptive changes (deep mode only)
    if (analysis.adaptiveness && analysis.adaptiveness.alternativePhrasings.length > 0) {
      changes.push({
        component: 'A',
        change: `Generated ${analysis.adaptiveness.alternativePhrasings.length} alternative approaches (see Adaptive Variations)`,
      });
    }

    // Reflective changes (deep mode only)
    if (analysis.reflectiveness) {
      changes.push({
        component: 'R',
        change: `Created validation checklist with ${analysis.reflectiveness.edgeCases.length} edge cases (see Reflection Checklist)`,
      });
    }

    // Fallback if no changes detected
    if (changes.length === 0) {
      changes.push({
        component: 'E',
        change: 'Structured the prompt with clear sections',
      });
    }

    return changes;
  }

  /**
   * Map CLEAR result to legacy PromptAnalysis format for backward compatibility
   */
  mapCLEARToLegacy(clearResult: CLEARResult): PromptAnalysis {
    return {
      gaps: clearResult.explicitness.issues,
      ambiguities: clearResult.conciseness.issues,
      strengths: this.extractCLEARStrengths(clearResult),
      suggestions: [
        ...clearResult.conciseness.suggestions,
        ...clearResult.logic.suggestions,
        ...clearResult.explicitness.suggestions,
      ],
    };
  }

  /**
   * Extract strengths from CLEAR analysis
   */
  private extractCLEARStrengths(clearResult: CLEARResult): string[] {
    const strengths: string[] = [];

    if (clearResult.conciseness.score >= 80) {
      strengths.push('[C] Concise and focused language');
    }
    if (clearResult.logic.score >= 80) {
      strengths.push('[L] Well-structured logical flow');
    }
    if (clearResult.explicitness.score >= 80) {
      strengths.push('[E] Clear and explicit specifications');
    }
    if (clearResult.adaptiveness && clearResult.adaptiveness.score >= 80) {
      strengths.push('[A] Flexible and adaptable approach');
    }
    if (clearResult.reflectiveness && clearResult.reflectiveness.score >= 80) {
      strengths.push('[R] Strong validation and reflection criteria');
    }

    if (strengths.length === 0) {
      strengths.push('Prompt has been structured for improvement');
    }

    return strengths;
  }

  /**
   * Find gaps in the prompt
   */
  private findGaps(prompt: string): string[] {
    const gaps: string[] = [];

    if (!this.hasContext(prompt)) {
      gaps.push('Missing context: What is the background or current situation?');
    }

    if (!this.hasSuccessCriteria(prompt)) {
      gaps.push('No success criteria: How will you know when this is complete?');
    }

    if (!this.hasTechnicalDetails(prompt)) {
      gaps.push('Missing technical details: What technologies or constraints apply?');
    }

    if (!this.hasUserNeeds(prompt)) {
      gaps.push('No user perspective: Who will use this and what do they need?');
    }

    if (!this.hasExpectedOutput(prompt)) {
      gaps.push('Unclear expected output: What should the final deliverable look like?');
    }

    return gaps;
  }

  /**
   * Find ambiguities in the prompt
   */
  private findAmbiguities(prompt: string): string[] {
    const ambiguities: string[] = [];

    // Check for vague terms
    const vagueTerms = ['some', 'maybe', 'probably', 'should', 'could', 'nice to have'];
    for (const term of vagueTerms) {
      if (new RegExp(`\\b${term}\\b`, 'i').test(prompt)) {
        ambiguities.push(`Vague term: "${term}" - be more specific`);
      }
    }

    // Check for undefined pronouns
    if (/(this|that|these|those|it)\s+/gi.test(prompt) && prompt.length < 100) {
      ambiguities.push('Undefined references: What does "this" or "it" refer to?');
    }

    // Check for unspecified quantities
    if (/\b(many|several|few|some)\b/i.test(prompt)) {
      ambiguities.push('Unspecified quantities: How many exactly?');
    }

    return ambiguities;
  }

  /**
   * Find strengths in the prompt
   */
  private findStrengths(prompt: string): string[] {
    const strengths: string[] = [];

    if (this.hasContext(prompt)) {
      strengths.push('Clear context provided');
    }

    if (this.hasTechnicalDetails(prompt)) {
      strengths.push('Technical constraints specified');
    }

    if (this.hasSuccessCriteria(prompt)) {
      strengths.push('Success criteria defined');
    }

    if (prompt.length > 200) {
      strengths.push('Comprehensive detail provided');
    }

    if (/example|such as|like|e\.g\./i.test(prompt)) {
      strengths.push('Includes examples for clarity');
    }

    return strengths;
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(prompt: string): string[] {
    const suggestions: string[] = [];

    if (!this.hasContext(prompt)) {
      suggestions.push('Add background: Explain the current situation or problem');
    }

    if (!this.hasSuccessCriteria(prompt)) {
      suggestions.push('Define success: Specify measurable criteria for completion');
    }

    if (!this.hasTechnicalDetails(prompt)) {
      suggestions.push('Add constraints: Specify technologies, integrations, or performance needs');
    }

    if (prompt.length < 50) {
      suggestions.push('Expand detail: Add more specific requirements and context');
    }

    if (!this.hasUserNeeds(prompt)) {
      suggestions.push('Consider users: Who will use this and what do they need?');
    }

    return suggestions;
  }

  /**
   * Generate improved prompt with structure
   */
  private generateImprovedPrompt(original: string, _analysis: PromptAnalysis): string {
    let improved = '# Objective\n\n';
    improved += this.extractOrInferObjective(original) + '\n\n';

    improved += '# Requirements\n\n';
    improved += this.extractOrInferRequirements(original) + '\n\n';

    improved += '# Technical Constraints\n\n';
    improved += this.extractOrInferTechnical(original) + '\n\n';

    improved += '# Expected Output\n\n';
    improved += this.extractOrInferOutput(original) + '\n\n';

    improved += '# Success Criteria\n\n';
    improved += this.extractOrInferSuccess(original) + '\n';

    return improved;
  }

  // Helper methods for analysis
  private hasContext(prompt: string): boolean {
    return /\b(background|context|currently|existing|problem|issue|because)\b/i.test(prompt);
  }

  private hasSuccessCriteria(prompt: string): boolean {
    return /\b(success|complete|done|measure|metric|goal|should be able to)\b/i.test(prompt);
  }

  private hasTechnicalDetails(prompt: string): boolean {
    const techTerms = /\b(react|vue|angular|node|python|java|typescript|api|database|sql|nosql|aws|docker|kubernetes)\b/i;
    return techTerms.test(prompt) || /\b(integrate|performance|scale|security)\b/i.test(prompt);
  }

  private hasUserNeeds(prompt: string): boolean {
    return /\b(user|customer|client|team|developer|admin|visitor)\b/i.test(prompt);
  }

  private hasExpectedOutput(prompt: string): boolean {
    return /\b(output|result|deliverable|should|look like|include|contain)\b/i.test(prompt);
  }

  private extractOrInferObjective(prompt: string): string {
    // Try to find action verbs at the start
    const actionMatch = prompt.match(/^(create|build|develop|implement|add|update|fix|refactor|design)\s+(.+)/i);
    if (actionMatch) {
      return `${actionMatch[1]} ${actionMatch[2]}`;
    }
    return prompt.split('\n')[0] || prompt.substring(0, 100);
  }

  private extractOrInferRequirements(prompt: string): string {
    const lines = prompt.split('\n').filter((line) => line.trim());
    if (lines.length > 1) {
      return lines.slice(1).map((line) => `- ${line}`).join('\n');
    }
    return '- ' + prompt + '\n- [Add specific requirements based on objective]';
  }

  private extractOrInferTechnical(original: string): string {
    const techStack: string[] = [];

    if (/react/i.test(original)) techStack.push('React');
    if (/typescript/i.test(original)) techStack.push('TypeScript');
    if (/node/i.test(original)) techStack.push('Node.js');
    if (/python/i.test(original)) techStack.push('Python');

    if (techStack.length > 0) {
      return '- Technology stack: ' + techStack.join(', ') + '\n- [Add other constraints]';
    }

    return '- [Specify technologies, integrations, performance requirements]';
  }

  private extractOrInferOutput(original: string): string {
    if (/component|page|ui/i.test(original)) {
      return '- Functional, tested component\n- Responsive design\n- Accessible implementation';
    }
    if (/api|endpoint|service/i.test(original)) {
      return '- Working API endpoint(s)\n- Error handling\n- Documentation';
    }
    return '- [Describe what the final deliverable should look like]';
  }

  private extractOrInferSuccess(_original: string): string {
    return '- Implementation matches requirements\n- All edge cases handled\n- Code is tested and documented\n- [Add specific success metrics]';
  }

  // New helper methods for mode support

  /**
   * Count missing critical elements
   */
  private countMissingCriticalElements(prompt: string): number {
    let missing = 0;

    if (!this.hasContext(prompt)) missing++;
    if (!this.hasTechnicalDetails(prompt)) missing++;
    if (!this.hasSuccessCriteria(prompt)) missing++;
    if (!this.hasUserNeeds(prompt)) missing++;
    if (!this.hasExpectedOutput(prompt)) missing++;

    return missing;
  }

  /**
   * Check for vague scope words without sufficient context
   */
  private hasVagueScopeWithoutContext(prompt: string): boolean {
    const vagueScopeWords = /\b(app|system|repository|project|platform|solution|tool|service)\b/i;

    if (!vagueScopeWords.test(prompt)) {
      return false;
    }

    // Check if there's sufficient context
    const hasSpecificPurpose = /\b(for|to|that|which|enables|allows|helps)\b.{10,}/i.test(prompt);
    const hasTechStack = this.hasTechnicalDetails(prompt);
    const hasDetailedRequirements = prompt.length > 100;

    return !(hasSpecificPurpose && (hasTechStack || hasDetailedRequirements));
  }

  /**
   * Check if prompt has a clear goal
   */
  private hasClearGoal(prompt: string): boolean {
    const actionVerbs = /^(create|build|develop|implement|add|update|fix|refactor|design|make|write)\b/i;
    return actionVerbs.test(prompt.trim()) || /objective|goal|purpose/i.test(prompt);
  }

  /**
   * Check if prompt uses actionable language
   */
  private hasActionableLanguage(prompt: string): boolean {
    const actionWords = /\b(create|build|implement|add|update|remove|fix|test|deploy|configure|setup)\b/i;
    return actionWords.test(prompt);
  }

  /**
   * Check if prompt has reasonable scope
   */
  private hasReasonableScope(prompt: string): boolean {
    // Too vague (unreasonably broad)
    const tooVague = /^(build an app|create a system|make a platform)$/i.test(prompt.trim());

    // Too specific (unreasonably narrow)
    const tooSpecific = prompt.length > 1000;

    return !tooVague && !tooSpecific;
  }

  /**
   * Generate changes summary
   */
  private generateChangesSummary(original: string, improved: string): ChangesSummary {
    const changes: string[] = [];

    if (!this.hasContext(original) && /# Objective/.test(improved)) {
      changes.push('Added clear objective and context');
    }

    if (!this.hasTechnicalDetails(original) && /# Technical Constraints/.test(improved)) {
      changes.push('Added technical constraints and requirements');
    }

    if (!this.hasSuccessCriteria(original) && /# Success Criteria/.test(improved)) {
      changes.push('Defined measurable success criteria');
    }

    if (!this.hasExpectedOutput(original) && /# Expected Output/.test(improved)) {
      changes.push('Specified expected deliverables');
    }

    if (original.length < 100 && improved.length > 100) {
      changes.push('Expanded prompt with structured sections');
    }

    if (changes.length === 0) {
      changes.push('Refined and structured the existing prompt');
    }

    return { changes };
  }

  /**
   * Generate alternative phrasings (deep mode)
   */
  private generateAlternativePhrasings(prompt: string): string[] {
    const phrasings: string[] = [];
    const mainAction = prompt.match(/^(create|build|develop|implement|add)/i)?.[0] || 'Implement';

    phrasings.push(`${mainAction} a solution that ${this.extractCoreRequirement(prompt)}`);
    phrasings.push(`Design and implement ${this.extractCoreRequirement(prompt)}`);
    phrasings.push(`Build a system to ${this.extractCoreRequirement(prompt)}`);

    return phrasings.slice(0, 3);
  }

  /**
   * Identify edge cases in requirements (deep mode)
   */
  private identifyEdgeCases(prompt: string): string[] {
    const edgeCases: string[] = [];

    if (/user|login|auth/i.test(prompt)) {
      edgeCases.push('What happens when user is not authenticated?');
      edgeCases.push('How to handle expired sessions?');
    }

    if (/api|endpoint|request/i.test(prompt)) {
      edgeCases.push('How to handle network failures or timeouts?');
      edgeCases.push('What validation is needed for input data?');
    }

    if (/form|input|data/i.test(prompt)) {
      edgeCases.push('How to handle invalid or malformed input?');
      edgeCases.push('What happens with empty or missing fields?');
    }

    if (edgeCases.length === 0) {
      edgeCases.push('Consider error states and failure scenarios');
      edgeCases.push('Think about boundary conditions and limits');
    }

    return edgeCases;
  }

  /**
   * Generate implementation examples (deep mode)
   */
  private generateImplementationExamples(_prompt: string): { good: string[]; bad: string[] } {
    return {
      good: [
        'Clear, specific requirements with measurable outcomes',
        'Includes context about why this is needed',
        'Specifies technical constraints and success criteria',
      ],
      bad: [
        'Vague requirements without context',
        'No success criteria or expected output',
        'Missing technical constraints and user perspective',
      ],
    };
  }

  /**
   * Suggest alternative prompt structures (deep mode)
   */
  private suggestAlternativeStructures(_prompt: string): Array<{ structure: string; benefits: string }> {
    return [
      {
        structure: 'User Story Format: As a [user], I want [goal] so that [benefit]',
        benefits: 'Focuses on user needs and value delivery',
      },
      {
        structure: 'Job Story Format: When [situation], I want to [motivation], so I can [expected outcome]',
        benefits: 'Emphasizes context and outcomes over personas',
      },
      {
        structure: 'Structured Sections: Objective, Requirements, Constraints, Success Criteria',
        benefits: 'Provides clear organization and comprehensive coverage',
      },
    ];
  }

  /**
   * Identify potential issues with the prompt (deep mode)
   */
  private identifyPotentialIssues(prompt: string): string[] {
    const issues: string[] = [];

    if (prompt.length < 30) {
      issues.push('Prompt may be too vague - could be interpreted in multiple ways');
    }

    if (!this.hasSuccessCriteria(prompt)) {
      issues.push('Without success criteria, it will be hard to know when the task is complete');
    }

    if (!this.hasTechnicalDetails(prompt)) {
      issues.push('Missing technical details may lead to incorrect technology choices');
    }

    if (!this.hasUserNeeds(prompt)) {
      issues.push('Without user perspective, solution may not meet actual needs');
    }

    return issues;
  }

  /**
   * Extract core requirement from prompt
   */
  private extractCoreRequirement(prompt: string): string {
    // Remove action verbs and extract the core requirement
    const cleaned = prompt.replace(/^(create|build|develop|implement|add|update|fix)\s+/i, '');
    return cleaned.split('.')[0] || cleaned.substring(0, 100);
  }
}

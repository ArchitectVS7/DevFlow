/**
 * PromptOptimizer - Analyzes and improves prompts using the COSTAR Framework
 * COSTAR Framework: Context, Objective, Style, Tone, Audience, Response
 * Reference: Based on Gemini migration guide for COSTAR framework
 */

export type OptimizerMode = 'fast' | 'deep';

export interface PromptAnalysis {
  gaps: string[];
  ambiguities: string[];
  strengths: string[];
  suggestions: string[];
}

// COSTAR Framework Interfaces
export interface ContextAnalysis {
  score: number; // 0-100
  hasBackground: boolean;
  hasConstraints: boolean;
  situationClarity: number; // 0-100%
  issues: string[];
  suggestions: string[];
}

export interface ObjectiveAnalysis {
  score: number; // 0-100
  goalClarity: boolean;
  measurable: boolean;
  achievable: boolean;
  clarityScore: number; // 0-100%
  issues: string[];
  suggestions: string[];
}

export interface StyleAnalysis {
  score: number; // 0-100
  formatSpecified: boolean;
  structureDefined: boolean;
  presentationClear: boolean;
  issues: string[];
  suggestions: string[];
}

export interface ToneAnalysis {
  score: number; // 0-100
  toneSpecified: boolean;
  voiceConsistency: boolean;
  formalityLevel: 'formal' | 'casual' | 'technical' | 'unspecified';
  issues: string[];
  suggestions: string[];
}

export interface AudienceAnalysis {
  score: number; // 0-100
  audienceSpecified: boolean;
  skillLevelDefined: boolean;
  needsAddressed: boolean;
  issues: string[];
  suggestions: string[];
}

export interface ResponseAnalysis {
  score: number; // 0-100
  outputFormatClear: boolean;
  deliverablesSpecified: boolean;
  examplesProvided: boolean;
  issues: string[];
  suggestions: string[];
}

export interface COSTARResult {
  context: ContextAnalysis;
  objective: ObjectiveAnalysis;
  style: StyleAnalysis;
  tone?: ToneAnalysis; // Only in deep mode
  audience?: AudienceAnalysis; // Only in deep mode
  response?: ResponseAnalysis; // Only in deep mode
  overallScore: number;
  improvedPrompt: string;
  changesSummary: Array<{
    component: 'C' | 'O' | 'S' | 'T' | 'A' | 'R';
    change: string;
  }>;
}

export interface COSTARScore {
  overall: number;
  context: number;
  objective: number;
  style: number;
  tone?: number;
  audience?: number;
  response?: number;
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
  performTriage(prompt: string, costarResult?: COSTARResult): TriageResult {
    const reasons: string[] = [];

    if (costarResult) {
      // Use COSTAR scores for triage
      if (costarResult.context.score < 60) {
        reasons.push('Context score below 60% - needs richer background information');
      }
      if (costarResult.objective.score < 60) {
        reasons.push('Objective score below 60% - goal needs clarification');
      }
      if (costarResult.style.score < 50) {
        reasons.push('Style score below 50% - output format not well-defined');
      }
    } else {
      // Fallback triage logic
      if (prompt.trim().length < 20) {
        reasons.push('Prompt is very short (< 20 characters)');
      }

      const criticalElements = this.countMissingCriticalElements(prompt);
      if (criticalElements >= 3) {
        reasons.push(`Missing ${criticalElements} critical elements`);
      }
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
   * Generate an improved version of the prompt (legacy method)
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
   * Apply COSTAR Framework analysis to a prompt
   * C = Context, O = Objective, S = Style, T = Tone (deep), A = Audience (deep), R = Response (deep)
   */
  applyCOSTARFramework(prompt: string, mode: OptimizerMode = 'fast'): COSTARResult {
    // Analyze core components (always)
    const context = this.analyzeContext(prompt);
    const objective = this.analyzeObjective(prompt);
    const style = this.analyzeStyle(prompt);

    let tone: ToneAnalysis | undefined;
    let audience: AudienceAnalysis | undefined;
    let response: ResponseAnalysis | undefined;

    if (mode === 'deep') {
      tone = this.analyzeTone(prompt);
      audience = this.analyzeAudience(prompt);
      response = this.analyzeResponse(prompt);
    }

    // Generate improved prompt based on COSTAR analysis
    const improvedPrompt = this.generateCOSTARImprovedPrompt(prompt, {
      context,
      objective,
      style,
      tone,
      audience,
      response,
    });

    // Generate changes summary with COSTAR labels
    const changesSummary = this.generateCOSTARChangesSummary(prompt, improvedPrompt, {
      context,
      objective,
      style,
      tone,
      audience,
      response,
    });

    // Calculate overall score
    const overallScore = this.calculateCOSTARScore({
      context,
      objective,
      style,
      tone,
      audience,
      response,
    }).overall;

    return {
      context,
      objective,
      style,
      tone,
      audience,
      response,
      overallScore,
      improvedPrompt,
      changesSummary,
    };
  }

  /**
   * Analyze Context (C): Background, situation, and constraints
   */
  analyzeContext(prompt: string): ContextAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for background/situation
    const hasBackground =
      /\b(background|context|currently|existing|situation|given that|considering)\b/i.test(
        prompt
      ) || /\b(you are|you're working|the project|this is)\b/i.test(prompt);

    if (!hasBackground) {
      issues.push('No background or situational context provided');
      suggestions.push('[C] Add background: Explain the current situation or problem context');
    }

    // Check for constraints
    const hasConstraints =
      /\b(constraint|limitation|requirement|must|cannot|should not|restricted)\b/i.test(prompt) ||
      /\b(using|with|without|requires|needs)\b/i.test(prompt);

    if (!hasConstraints) {
      issues.push('Constraints or requirements not specified');
      suggestions.push(
        '[C] Specify constraints: Technologies, limitations, or requirements that apply'
      );
    }

    // Calculate situation clarity
    let situationClarity = 0;
    if (hasBackground) situationClarity += 50;
    if (hasConstraints) situationClarity += 30;
    if (this.hasTechnicalDetails(prompt)) situationClarity += 20;

    // Calculate score
    let score = 0;
    if (hasBackground) score += 50;
    if (hasConstraints) score += 30;
    if (this.hasTechnicalDetails(prompt)) score += 20;

    return {
      score: Math.min(100, score),
      hasBackground,
      hasConstraints,
      situationClarity,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Objective (O): Clear goal and desired outcome
   */
  analyzeObjective(prompt: string): ObjectiveAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for clear goal
    const goalClarity =
      /^(create|build|develop|implement|add|update|fix|refactor|design|generate)\b/i.test(
        prompt.trim()
      ) || /\b(objective|goal|purpose|aim|want to|need to)\b/i.test(prompt);

    if (!goalClarity) {
      issues.push('Goal or objective not clearly stated');
      suggestions.push('[O] State objective clearly: Use action verbs (create, build, implement)');
    }

    // Check if measurable
    const measurable =
      this.hasSuccessCriteria(prompt) ||
      /\b(measure|metric|complete when|done when|success)\b/i.test(prompt);

    if (!measurable) {
      issues.push('Objective not measurable');
      suggestions.push('[O] Make objective measurable: Define what success looks like');
    }

    // Check if achievable
    const achievable = !this.hasUnrealisticScope(prompt);

    if (!achievable) {
      issues.push('Objective may be too broad or unrealistic');
      suggestions.push('[O] Refine scope: Break down into achievable, focused goal');
    }

    // Calculate clarity score
    let clarityScore = 0;
    if (goalClarity) clarityScore += 40;
    if (measurable) clarityScore += 30;
    if (achievable) clarityScore += 30;

    // Calculate overall score
    let score = 0;
    if (goalClarity) score += 40;
    if (measurable) score += 30;
    if (achievable) score += 30;

    return {
      score: Math.min(100, score),
      goalClarity,
      measurable,
      achievable,
      clarityScore,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Style (S): Format, structure, and presentation
   */
  analyzeStyle(prompt: string): StyleAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for format specification
    const formatSpecified =
      /\b(format|markdown|json|code|list|table|bullet|numbered|xml|yaml)\b/i.test(prompt) ||
      /\b(provide as|structure as|present as|organize)\b/i.test(prompt);

    if (!formatSpecified) {
      issues.push('Output format not specified');
      suggestions.push(
        '[S] Specify format: Define how output should be presented (markdown, code, list)'
      );
    }

    // Check for structure definition
    const structureDefined =
      /\b(section|heading|organize|structure|step|phase|part)\b/i.test(prompt) ||
      /\b(include|contain|with|having)\b/i.test(prompt);

    if (!structureDefined) {
      issues.push('Structure or organization not defined');
      suggestions.push('[S] Define structure: Specify how information should be organized');
    }

    // Check for presentation clarity
    const presentationClear =
      formatSpecified && (structureDefined || /\b(example|sample|like|such as)\b/i.test(prompt));

    if (!presentationClear) {
      suggestions.push(
        '[S] Clarify presentation: Add examples or specify organization preferences'
      );
    }

    // Calculate score
    let score = 0;
    if (formatSpecified) score += 40;
    if (structureDefined) score += 35;
    if (presentationClear) score += 25;

    return {
      score: Math.min(100, score),
      formatSpecified,
      structureDefined,
      presentationClear,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Tone (T): Voice and formality level (Deep mode only)
   */
  analyzeTone(prompt: string): ToneAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for tone specification
    const toneSpecified =
      /\b(tone|voice|style|formal|informal|casual|professional|friendly|technical)\b/i.test(prompt);

    if (!toneSpecified) {
      issues.push('Tone or voice not specified');
      suggestions.push(
        '[T] Specify tone: Define desired communication style (professional, casual, technical)'
      );
    }

    // Check voice consistency requirements
    const voiceConsistency =
      /\b(consistent|throughout|maintain|keep)\b/i.test(prompt) && toneSpecified;

    // Determine formality level
    let formalityLevel: 'formal' | 'casual' | 'technical' | 'unspecified' = 'unspecified';

    if (/\b(formal|professional|business)\b/i.test(prompt)) {
      formalityLevel = 'formal';
    } else if (/\b(casual|friendly|conversational|informal)\b/i.test(prompt)) {
      formalityLevel = 'casual';
    } else if (/\b(technical|precise|expert|developer)\b/i.test(prompt)) {
      formalityLevel = 'technical';
    }

    if (formalityLevel === 'unspecified' && toneSpecified) {
      suggestions.push(
        '[T] Clarify formality: Specify whether formal, casual, or technical tone is preferred'
      );
    }

    // Calculate score
    let score = 0;
    if (toneSpecified) score += 50;
    if (voiceConsistency) score += 25;
    if (formalityLevel !== 'unspecified') score += 25;

    return {
      score: Math.min(100, score),
      toneSpecified,
      voiceConsistency,
      formalityLevel,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Audience (A): Target users and skill level (Deep mode only)
   */
  analyzeAudience(prompt: string): AudienceAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for audience specification
    const audienceSpecified =
      /\b(for|target|audience|user|developer|beginner|expert|senior|junior|team)\b/i.test(prompt) ||
      /\b(who will|intended for|designed for)\b/i.test(prompt);

    if (!audienceSpecified) {
      issues.push('Target audience not specified');
      suggestions.push(
        '[A] Define audience: Specify who will use this (developers, beginners, experts)'
      );
    }

    // Check for skill level definition
    const skillLevelDefined =
      /\b(beginner|intermediate|advanced|expert|senior|junior|novice|experienced)\b/i.test(
        prompt
      ) || /\b(familiar with|knowledge of|assumes)\b/i.test(prompt);

    if (!skillLevelDefined && audienceSpecified) {
      suggestions.push('[A] Specify skill level: Define expertise level of target audience');
    }

    // Check if audience needs are addressed
    const needsAddressed =
      audienceSpecified &&
      (skillLevelDefined || /\b(needs|requires|wants|looking for)\b/i.test(prompt));

    if (!needsAddressed && audienceSpecified) {
      suggestions.push('[A] Address needs: Consider specific needs of the target audience');
    }

    // Calculate score
    let score = 0;
    if (audienceSpecified) score += 40;
    if (skillLevelDefined) score += 35;
    if (needsAddressed) score += 25;

    return {
      score: Math.min(100, score),
      audienceSpecified,
      skillLevelDefined,
      needsAddressed,
      issues,
      suggestions,
    };
  }

  /**
   * Analyze Response (R): Expected output and deliverables (Deep mode only)
   */
  analyzeResponse(prompt: string): ResponseAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for clear output format
    const outputFormatClear =
      /\b(output|result|deliverable|return|provide|generate)\b/i.test(prompt) ||
      this.hasExpectedOutput(prompt);

    if (!outputFormatClear) {
      issues.push('Expected output format not clear');
      suggestions.push('[R] Clarify output: Specify what should be returned or delivered');
    }

    // Check for deliverables specification
    const deliverablesSpecified =
      /\b(deliverable|include|provide|contain|with|having)\b/i.test(prompt) &&
      /\b(code|documentation|test|example|file)\b/i.test(prompt);

    if (!deliverablesSpecified) {
      issues.push('Specific deliverables not listed');
      suggestions.push(
        '[R] List deliverables: Specify concrete outputs (code, docs, tests, examples)'
      );
    }

    // Check for examples
    const examplesProvided =
      /\b(example|sample|such as|like|e\.g\.|for instance|similar to)\b/i.test(prompt);

    if (!examplesProvided) {
      suggestions.push('[R] Provide examples: Include sample outputs or references');
    }

    // Calculate score
    let score = 0;
    if (outputFormatClear) score += 40;
    if (deliverablesSpecified) score += 40;
    if (examplesProvided) score += 20;

    return {
      score: Math.min(100, score),
      outputFormatClear,
      deliverablesSpecified,
      examplesProvided,
      issues,
      suggestions,
    };
  }

  /**
   * Calculate overall COSTAR score with weighted components
   */
  calculateCOSTARScore(analysis: {
    context: ContextAnalysis;
    objective: ObjectiveAnalysis;
    style: StyleAnalysis;
    tone?: ToneAnalysis;
    audience?: AudienceAnalysis;
    response?: ResponseAnalysis;
  }): COSTARScore {
    const { context, objective, style, tone, audience, response } = analysis;

    let overall: number;
    let rating: 'excellent' | 'good' | 'needs-improvement' | 'poor';

    if (tone && audience && response) {
      // Deep mode: weight all 6 components
      overall =
        context.score * 0.2 +
        objective.score * 0.2 +
        style.score * 0.15 +
        tone.score * 0.15 +
        audience.score * 0.15 +
        response.score * 0.15;
    } else {
      // Fast mode: weight only C, O, S
      overall = context.score * 0.35 + objective.score * 0.35 + style.score * 0.3;
    }

    // Determine rating
    if (overall >= 80) rating = 'excellent';
    else if (overall >= 60) rating = 'good';
    else if (overall >= 40) rating = 'needs-improvement';
    else rating = 'poor';

    return {
      overall: Math.round(overall),
      context: context.score,
      objective: objective.score,
      style: style.score,
      tone: tone?.score,
      audience: audience?.score,
      response: response?.score,
      rating,
    };
  }

  /**
   * Generate improved prompt using COSTAR framework insights
   */
  private generateCOSTARImprovedPrompt(
    original: string,
    analysis: {
      context: ContextAnalysis;
      objective: ObjectiveAnalysis;
      style: StyleAnalysis;
      tone?: ToneAnalysis;
      audience?: AudienceAnalysis;
      response?: ResponseAnalysis;
    }
  ): string {
    let improved = '';

    // Apply Context: Add background and constraints
    improved += '## CONTEXT\n\n';
    if (!analysis.context.hasBackground) {
      improved += 'Background: ' + this.extractOrInferContext(original) + '\n\n';
    } else {
      improved += this.extractOrInferContext(original) + '\n\n';
    }

    if (!analysis.context.hasConstraints && this.hasTechnicalDetails(original)) {
      improved += 'Constraints: ' + this.extractOrInferTechnical(original) + '\n\n';
    }

    // Apply Objective: Add clear goal
    improved += '## OBJECTIVE\n\n';
    improved += this.extractOrInferObjective(original) + '\n\n';

    // Apply Style: Add format and structure
    improved += '## STYLE\n\n';
    if (!analysis.style.formatSpecified) {
      improved += 'Format: Provide response as structured, well-organized output\n';
    }
    if (!analysis.style.structureDefined) {
      improved += 'Structure: Organize with clear sections and headings\n';
    }
    improved += '\n';

    // Apply Tone (Deep mode only)
    if (analysis.tone) {
      improved += '## TONE\n\n';
      if (!analysis.tone.toneSpecified) {
        improved += 'Use a professional, technical tone appropriate for developers\n\n';
      } else {
        improved += this.extractToneGuidance(original) + '\n\n';
      }
    }

    // Apply Audience (Deep mode only)
    if (analysis.audience) {
      improved += '## AUDIENCE\n\n';
      if (!analysis.audience.audienceSpecified) {
        improved +=
          'Target audience: Senior developers with expertise in the relevant technology stack\n\n';
      } else {
        improved += this.extractAudienceDefinition(original) + '\n\n';
      }
    }

    // Apply Response (Deep mode only)
    if (analysis.response) {
      improved += '## RESPONSE\n\n';
      improved += 'Expected deliverables:\n';
      if (!analysis.response.deliverablesSpecified) {
        improved += '- Complete implementation\n';
        improved += '- Documentation\n';
        improved += '- Test coverage\n\n';
      } else {
        improved += this.extractDeliverables(original) + '\n\n';
      }
    }

    improved += '---\n\n';
    improved += '# Requirements\n\n';
    improved += this.extractOrInferRequirements(original);

    return improved.trim();
  }

  /**
   * Generate COSTAR-labeled changes summary
   */
  private generateCOSTARChangesSummary(
    original: string,
    _improved: string,
    analysis: {
      context: ContextAnalysis;
      objective: ObjectiveAnalysis;
      style: StyleAnalysis;
      tone?: ToneAnalysis;
      audience?: AudienceAnalysis;
      response?: ResponseAnalysis;
    }
  ): Array<{ component: 'C' | 'O' | 'S' | 'T' | 'A' | 'R'; change: string }> {
    const changes: Array<{ component: 'C' | 'O' | 'S' | 'T' | 'A' | 'R'; change: string }> = [];

    // Context changes
    if (!analysis.context.hasBackground) {
      changes.push({
        component: 'C',
        change: 'Added background context and situational details',
      });
    }
    if (!analysis.context.hasConstraints) {
      changes.push({
        component: 'C',
        change: 'Specified constraints and requirements',
      });
    }

    // Objective changes
    if (!analysis.objective.goalClarity) {
      changes.push({
        component: 'O',
        change: 'Clarified objective with clear goal statement',
      });
    }
    if (!analysis.objective.measurable) {
      changes.push({
        component: 'O',
        change: 'Made objective measurable with success criteria',
      });
    }

    // Style changes
    if (!analysis.style.formatSpecified) {
      changes.push({
        component: 'S',
        change: 'Specified output format and presentation style',
      });
    }
    if (!analysis.style.structureDefined) {
      changes.push({
        component: 'S',
        change: 'Defined structure and organization approach',
      });
    }

    // Tone changes (deep mode only)
    if (analysis.tone && !analysis.tone.toneSpecified) {
      changes.push({
        component: 'T',
        change: 'Added tone guidance for appropriate communication style',
      });
    }

    // Audience changes (deep mode only)
    if (analysis.audience && !analysis.audience.audienceSpecified) {
      changes.push({
        component: 'A',
        change: 'Defined target audience and skill level',
      });
    }

    // Response changes (deep mode only)
    if (analysis.response && !analysis.response.outputFormatClear) {
      changes.push({
        component: 'R',
        change: 'Specified expected deliverables and response format',
      });
    }

    // Fallback if no changes detected
    if (changes.length === 0) {
      changes.push({
        component: 'O',
        change: 'Structured the prompt with COSTAR framework sections',
      });
    }

    return changes;
  }

  /**
   * Map COSTAR result to legacy PromptAnalysis format for backward compatibility
   */
  mapCOSTARToLegacy(costarResult: COSTARResult): PromptAnalysis {
    return {
      gaps: costarResult.context.issues.concat(costarResult.objective.issues),
      ambiguities: costarResult.style.issues,
      strengths: this.extractCOSTARStrengths(costarResult),
      suggestions: [
        ...costarResult.context.suggestions,
        ...costarResult.objective.suggestions,
        ...costarResult.style.suggestions,
      ],
    };
  }

  /**
   * Extract strengths from COSTAR analysis
   */
  private extractCOSTARStrengths(costarResult: COSTARResult): string[] {
    const strengths: string[] = [];

    if (costarResult.context.score >= 80) {
      strengths.push('[C] Rich context with background and constraints');
    }
    if (costarResult.objective.score >= 80) {
      strengths.push('[O] Clear, measurable objective');
    }
    if (costarResult.style.score >= 80) {
      strengths.push('[S] Well-defined format and structure');
    }
    if (costarResult.tone && costarResult.tone.score >= 80) {
      strengths.push('[T] Appropriate tone and voice specified');
    }
    if (costarResult.audience && costarResult.audience.score >= 80) {
      strengths.push('[A] Clear audience definition and skill level');
    }
    if (costarResult.response && costarResult.response.score >= 80) {
      strengths.push('[R] Clear deliverables and response format');
    }

    if (strengths.length === 0) {
      strengths.push('Prompt has been structured with COSTAR framework');
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
   * Generate improved prompt with structure (legacy method)
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
    return /\b(background|context|currently|existing|problem|issue|because|given|situation)\b/i.test(
      prompt
    );
  }

  private hasSuccessCriteria(prompt: string): boolean {
    return /\b(success|complete|done|measure|metric|goal|should be able to)\b/i.test(prompt);
  }

  private hasTechnicalDetails(prompt: string): boolean {
    const techTerms =
      /\b(react|vue|angular|node|python|java|typescript|api|database|sql|nosql|aws|docker|kubernetes)\b/i;
    return techTerms.test(prompt) || /\b(integrate|performance|scale|security)\b/i.test(prompt);
  }

  private hasUserNeeds(prompt: string): boolean {
    return /\b(user|customer|client|team|developer|admin|visitor|audience)\b/i.test(prompt);
  }

  private hasExpectedOutput(prompt: string): boolean {
    return /\b(output|result|deliverable|should|look like|include|contain|provide|return)\b/i.test(
      prompt
    );
  }

  private hasUnrealisticScope(prompt: string): boolean {
    // Check for overly broad goals
    const tooBroad = /^(build an? app|create a system|make a platform|develop everything)$/i.test(
      prompt.trim()
    );
    return tooBroad || (prompt.length < 30 && /\b(app|system|platform)\b/i.test(prompt));
  }

  private extractOrInferContext(prompt: string): string {
    // Extract context clues
    const contextMatch = prompt.match(
      /(background|context|currently|given|situation):\s*([^\n]+)/i
    );
    if (contextMatch) {
      return contextMatch[2];
    }

    // Infer from technical stack mentions
    if (this.hasTechnicalDetails(prompt)) {
      return `Working in a development environment with ${this.extractOrInferTechnical(prompt)}`;
    }

    return 'Development project requiring implementation of new functionality';
  }

  private extractOrInferObjective(prompt: string): string {
    // Try to find action verbs at the start
    const actionMatch = prompt.match(
      /^(create|build|develop|implement|add|update|fix|refactor|design|generate)\s+(.+)/i
    );
    if (actionMatch) {
      return `${actionMatch[1]} ${actionMatch[2]}`;
    }

    // Look for explicit objective statements
    const objectiveMatch = prompt.match(/(objective|goal|purpose):\s*([^\n]+)/i);
    if (objectiveMatch) {
      return objectiveMatch[2];
    }

    return prompt.split('\n')[0] || prompt.substring(0, 100);
  }

  private extractOrInferRequirements(prompt: string): string {
    const lines = prompt.split('\n').filter((line) => line.trim());
    if (lines.length > 1) {
      return lines
        .slice(1)
        .map((line) => `- ${line}`)
        .join('\n');
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

  private extractToneGuidance(prompt: string): string {
    if (/professional/i.test(prompt)) return 'Professional tone';
    if (/casual/i.test(prompt)) return 'Casual, friendly tone';
    if (/technical/i.test(prompt)) return 'Technical, precise tone';
    return 'Professional, clear tone';
  }

  private extractAudienceDefinition(prompt: string): string {
    if (/beginner/i.test(prompt))
      return 'Target audience: Beginners with basic programming knowledge';
    if (/senior|expert/i.test(prompt))
      return 'Target audience: Senior developers with deep expertise';
    return 'Target audience: Intermediate to advanced developers';
  }

  private extractDeliverables(prompt: string): string {
    const deliverables: string[] = [];

    if (/code/i.test(prompt)) deliverables.push('- Complete code implementation');
    if (/documentation|docs/i.test(prompt)) deliverables.push('- Documentation');
    if (/test/i.test(prompt)) deliverables.push('- Test coverage');
    if (/example/i.test(prompt)) deliverables.push('- Usage examples');

    return deliverables.length > 0 ? deliverables.join('\n') : '- [Specify deliverables]';
  }

  // Methods for deep mode support

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
   * Check if prompt has a clear goal
   */
  private hasClearGoal(prompt: string): boolean {
    const actionVerbs =
      /^(create|build|develop|implement|add|update|fix|refactor|design|make|write)\b/i;
    return actionVerbs.test(prompt.trim()) || /objective|goal|purpose/i.test(prompt);
  }

  /**
   * Check if prompt uses actionable language
   */
  private hasActionableLanguage(prompt: string): boolean {
    const actionWords =
      /\b(create|build|implement|add|update|remove|fix|test|deploy|configure|setup)\b/i;
    return actionWords.test(prompt);
  }

  /**
   * Check if prompt has reasonable scope
   */
  private hasReasonableScope(prompt: string): boolean {
    const tooVague = /^(build an? app|create a system|make a platform)$/i.test(prompt.trim());
    const tooSpecific = prompt.length > 1000;
    return !tooVague && !tooSpecific;
  }

  /**
   * Generate changes summary (legacy)
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
  private suggestAlternativeStructures(
    _prompt: string
  ): Array<{ structure: string; benefits: string }> {
    return [
      {
        structure: 'User Story Format: As a [user], I want [goal] so that [benefit]',
        benefits: 'Focuses on user needs and value delivery',
      },
      {
        structure:
          'Job Story Format: When [situation], I want to [motivation], so I can [expected outcome]',
        benefits: 'Emphasizes context and outcomes over personas',
      },
      {
        structure: 'COSTAR Format: Context, Objective, Style, Tone, Audience, Response',
        benefits: 'Comprehensive framework covering all critical aspects',
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
    const cleaned = prompt.replace(/^(create|build|develop|implement|add|update|fix)\s+/i, '');
    return cleaned.split('.')[0] || cleaned.substring(0, 100);
  }
}

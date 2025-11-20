import { describe, it, expect, beforeEach } from '@jest/globals';
import { PromptOptimizer, COSTARResult, COSTARScore } from '../../src/core/prompt-optimizer.js';

describe('PromptOptimizer', () => {
    let optimizer: PromptOptimizer;

    beforeEach(() => {
        optimizer = new PromptOptimizer();
    });

    describe('calculateCOSTARScore', () => {
        it('should correctly calculate overall score for Fast mode (C, O, S)', () => {
            const input = {
                context: { score: 100, hasBackground: true, hasConstraints: true, situationClarity: 100, issues: [], suggestions: [] },
                objective: { score: 100, goalClarity: true, measurable: true, achievable: true, clarityScore: 100, issues: [], suggestions: [] },
                style: { score: 100, formatSpecified: true, structureDefined: true, presentationClear: true, issues: [], suggestions: [] },
            };

            const score = optimizer.calculateCOSTARScore(input);

            expect(score.overall).toBe(100);
            expect(score.rating).toBe('excellent');
        });

        it('should correctly calculate weighted score for Fast mode', () => {
            // Fast mode weights: C(0.35) + O(0.35) + S(0.30)
            const input = {
                context: { score: 50, hasBackground: true, hasConstraints: true, situationClarity: 50, issues: [], suggestions: [] },   // 50 * 0.35 = 17.5
                objective: { score: 80, goalClarity: true, measurable: true, achievable: true, clarityScore: 80, issues: [], suggestions: [] }, // 80 * 0.35 = 28.0
                style: { score: 40, formatSpecified: true, structureDefined: true, presentationClear: true, issues: [], suggestions: [] },     // 40 * 0.30 = 12.0
            };

            // Expected: 17.5 + 28.0 + 12.0 = 57.5 -> 58
            const score = optimizer.calculateCOSTARScore(input);

            expect(score.overall).toBe(58);
            expect(score.rating).toBe('needs-improvement');
        });

        it('should correctly calculate overall score for Deep mode (C, O, S, T, A, R)', () => {
            // Deep mode weights: C(0.2) + O(0.2) + S(0.15) + T(0.15) + A(0.15) + R(0.15)
            const input = {
                context: { score: 100, hasBackground: true, hasConstraints: true, situationClarity: 100, issues: [], suggestions: [] },
                objective: { score: 100, goalClarity: true, measurable: true, achievable: true, clarityScore: 100, issues: [], suggestions: [] },
                style: { score: 100, formatSpecified: true, structureDefined: true, presentationClear: true, issues: [], suggestions: [] },
                tone: { score: 100, toneSpecified: true, voiceConsistency: true, formalityLevel: 'formal' as const, issues: [], suggestions: [] },
                audience: { score: 100, audienceSpecified: true, skillLevelDefined: true, needsAddressed: true, issues: [], suggestions: [] },
                response: { score: 100, outputFormatClear: true, deliverablesSpecified: true, examplesProvided: true, issues: [], suggestions: [] },
            };

            const score = optimizer.calculateCOSTARScore(input);

            expect(score.overall).toBe(100);
            expect(score.rating).toBe('excellent');
        });
    });
});

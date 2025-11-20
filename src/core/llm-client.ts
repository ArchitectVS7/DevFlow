import { AuditConfig } from '../types/config.js';

export class LlmClient {
    constructor(private config: AuditConfig) { }

    async complete(prompt: string): Promise<string> {
        const apiKey = process.env[this.config.apiKeyEnvVar];
        if (!apiKey) {
            throw new Error(`API key not found in environment variable: ${this.config.apiKeyEnvVar}`);
        }

        if (this.config.provider === 'openai') {
            return this.callOpenAI(apiKey, prompt);
        }

        // Basic support for other providers if they share the OpenAI format (often true for local/proxies)
        // But for now, explicit error.
        throw new Error(`Provider ${this.config.provider} not implemented yet`);
    }

    private async callOpenAI(apiKey: string, prompt: string): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API error: ${response.status} ${error}`);
        }

        const data = await response.json() as { choices: { message: { content: string } }[] };
        return data.choices[0].message.content;
    }
}

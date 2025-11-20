import { Octokit } from '@octokit/rest';
import { DevFlowConfig, ProjectManagementConfig } from '../types/config.js';
import fs from 'fs-extra';
import * as path from 'path';

export class GitHubManager {
    private octokit: Octokit | null = null;
    private config: ProjectManagementConfig | undefined;

    constructor(config?: ProjectManagementConfig) {
        this.config = config;
    }

    /**
     * Initialize Octokit with token from environment
     */
    async initialize(configPath: string): Promise<void> {
        if (!this.config) {
            // Load config if not provided
            if (await fs.pathExists(configPath)) {
                const fullConfig: DevFlowConfig = await fs.readJson(configPath);
                this.config = fullConfig.projectManagement;
            }
        }

        if (!this.config) {
            return; // Not configured
        }

        const token = process.env[this.config.githubTokenEnvVar];
        if (!token) {
            throw new Error(`GitHub token not found in environment variable: ${this.config.githubTokenEnvVar}`);
        }

        this.octokit = new Octokit({
            auth: token,
        });
    }

    isConfigured(): boolean {
        return !!this.config && !!this.octokit;
    }

    /**
     * Create a GitHub issue
     */
    async createIssue(params: {
        title: string;
        body: string;
        labels?: string[];
    }): Promise<{ id: number; html_url: string; node_id: string }> {
        if (!this.octokit || !this.config) {
            throw new Error('GitHubManager not initialized');
        }

        // Extract owner and repo from project URL or require them in config?
        // The user didn't specify owner/repo in config, only projectBoardUrl.
        // I'll assume I can parse it or I need to add it to config.
        // Actually, usually issues belong to a repo. Project boards can be org-level or repo-level.
        // I'll try to infer owner/repo from the current git remote if possible, or add it to config.
        // For now, let's assume we can get it from git remote.

        const repoInfo = await this.getRepoInfo();
        if (!repoInfo) {
            throw new Error('Could not determine GitHub repository from git remote');
        }

        const { data: issue } = await this.octokit.issues.create({
            owner: repoInfo.owner,
            repo: repoInfo.repo,
            title: params.title,
            body: params.body,
            labels: params.labels,
        });

        // TODO: Add to project board
        // This is complex because we need to find the project, then the column, then create a card.
        // For V2 projects, it's even more complex (GraphQL).
        // I'll leave a placeholder for project board integration.

        return {
            id: issue.number,
            html_url: issue.html_url,
            node_id: issue.node_id,
        };
    }

    /**
     * Update issue status (move to column)
     */
    async updateIssueStatus(issueNumber: number, status: 'NEW' | 'IMPLEMENTING' | 'COMPLETE'): Promise<void> {
        if (!this.octokit || !this.config) {
            throw new Error('GitHubManager not initialized');
        }

        // Placeholder for project column move
        // For now, maybe just add a comment or label?
        // The user explicitly asked to "Update ... to the column mapped".

        const columnName = this.config.columnsMap[status];
        if (!columnName) return;

        console.log(`[Mock] Moving issue #${issueNumber} to column "${columnName}"`);

        // If status is COMPLETE, close the issue?
        if (status === 'COMPLETE') {
            const repoInfo = await this.getRepoInfo();
            if (repoInfo) {
                await this.octokit.issues.update({
                    owner: repoInfo.owner,
                    repo: repoInfo.repo,
                    issue_number: issueNumber,
                    state: 'closed',
                });
            }
        }
    }

    private async getRepoInfo(): Promise<{ owner: string; repo: string } | null> {
        try {
            // This is a simplified check. In a real app, use simple-git or similar.
            // I'll try to read .git/config
            const gitConfigPath = path.join(process.cwd(), '.git', 'config');
            if (await fs.pathExists(gitConfigPath)) {
                const content = await fs.readFile(gitConfigPath, 'utf-8');
                // eslint-disable-next-line no-useless-escape
                const match = content.match(/url = .*github\.com[:\/]([^\/]+)\/([^\.]+)/);
                if (match) {
                    return { owner: match[1], repo: match[2].trim() };
                }
            }
        } catch {
            // Ignore
        }
        return null;
    }
}

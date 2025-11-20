/**
 * Configuration types for DevFlow
 */

export interface DevFlowConfig {
  version: string;
  providers: string[];
  templates: TemplateConfig;
  outputs: OutputConfig;
  preferences: PreferencesConfig;
  projectManagement?: ProjectManagementConfig;
  audit?: AuditConfig;
  experimental?: Record<string, unknown>;
}

export interface AuditConfig {
  provider: 'openai' | 'anthropic' | 'gemini';
  apiKeyEnvVar: string;
  model: string;
}

export interface ProjectManagementConfig {
  type: 'github';
  githubTokenEnvVar: string;
  projectBoardUrl: string;
  columnsMap: {
    NEW: string;
    IMPLEMENTING: string;
    COMPLETE: string;
  };
}

/**
 * Legacy config format from v1.3.0 and earlier
 */
export interface LegacyConfig {
  version: string;
  agent: string;
  templates: TemplateConfig;
  outputs: OutputConfig;
  preferences: PreferencesConfig;
  experimental?: Record<string, unknown>;
}

export interface TemplateConfig {
  prdQuestions: string;
  fullPrd: string;
  quickPrd: string;
}

export interface OutputConfig {
  path: string;
  format: 'markdown' | 'pdf';
}

export interface PreferencesConfig {
  autoOpenOutputs: boolean;
  verboseLogging: boolean;
  preserveSessions: boolean;
}

export const DEFAULT_CONFIG: DevFlowConfig = {
  version: '1.4.0',
  providers: [],
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
};

/**
 * Migrate legacy config (v1.3.0 and earlier) to new format
 */
export function migrateConfig(legacy: LegacyConfig): DevFlowConfig {
  return {
    version: '1.4.0',
    providers: [legacy.agent],
    templates: legacy.templates,
    outputs: legacy.outputs,
    preferences: legacy.preferences,
    experimental: legacy.experimental,
  };
}

/**
 * Check if config is legacy format
 */
export function isLegacyConfig(config: unknown): config is LegacyConfig {
  return (
    config !== null &&
    config !== undefined &&
    typeof config === 'object' &&
    'agent' in config &&
    typeof (config as { agent: unknown }).agent === 'string' &&
    !('providers' in config)
  );
}

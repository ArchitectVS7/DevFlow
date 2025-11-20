/**
 * Session management types
 *
 * Sessions store conversational state for the `devflow start` command,
 * allowing users to have multi-turn conversations that can be summarized later.
 */

/**
 * Complete session object with all data
 */
export interface Session {
  id: string;
  projectName: string;
  agent: string;
  created: Date;
  updated: Date;
  status: SessionStatus;
  messages: SessionMessage[];
  tags?: string[];
  description?: string;
}

/**
 * Session status tracking
 */
export type SessionStatus = 'active' | 'completed' | 'archived';

/**
 * Individual message in a conversation
 */
export interface SessionMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Lightweight metadata for session listings
 */
export interface SessionMetadata {
  id: string;
  projectName: string;
  agent: string;
  created: string;
  updated: string;
  status: SessionStatus;
  messageCount: number;
  tags?: string[];
  description?: string;
}

/**
 * Filter options for session queries
 */
export interface SessionFilter {
  status?: SessionStatus;
  projectName?: string;
  agent?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
}

/**
 * Serialized session for file storage
 * Uses ISO strings instead of Date objects
 */
export interface SerializedSession {
  id: string;
  projectName: string;
  agent: string;
  created: string;
  updated: string;
  status: SessionStatus;
  messages: SerializedSessionMessage[];
  tags?: string[];
  description?: string;
}

export interface SerializedSessionMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

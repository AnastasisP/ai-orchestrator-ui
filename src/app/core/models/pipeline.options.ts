import { ArchitectureResultOptions } from "./architecture.options";
import { FileTreeOptions } from "./file-tree.options";

export type AgentRole = 'ORCHESTRATOR' | 'ANALYZER' | 'ARCHITECT' | 'CODER' | 'IMPLEMENTER' | 'REVIEWER';
export type AgentStatus = 'waiting' | 'running' | 'complete' | 'error';
export type CanvasView = 'input' | 'execution' | 'architecture' | 'output' | 'history';

export interface AgentNodeOptions {
  role: AgentRole;
  status: AgentStatus;
  model: string;
  tokenUsage?: TokenUsageOptions;
  summary?: string;
  keyPoints?: string[];
  durationMs?: number;
  streamingText?: string;
}

export interface TokenUsageOptions {
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
}

export interface PipelineRunOptions {
  sessionId: string;
  pipeline: AgentRole[];
  estimatedCost: string;
}

export interface ProjectBriefOptions {
  request: string;
  sessionId?: string;
}

export interface SSEEventOptions {
  type: 'agent_start' | 'agent_chunk' | 'agent_complete' | 'pipeline_complete' | 'error';
  role?: AgentRole;
  data: unknown;
}

export interface ContextEntryOptions {
  role: AgentRole;
  summary: string;
  keyPoints: string[];
}

export interface AgentCompleteData {
  summary: string;
  keyPoints: string[];
  tokenUsage: TokenUsageOptions;
  architectureResult?: ArchitectureResultOptions;
  fileTree?: FileTreeOptions[];
  finalOutput?: string;
}
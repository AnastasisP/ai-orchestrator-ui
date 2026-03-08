import { AgentRole, AgentNodeOptions } from './pipeline.options';

export interface SessionOptions {
  id: string;
  originalRequest: string;
  status: 'running' | 'complete' | 'error';
  pipeline: AgentRole[];
  totalCostUsd: number;
  createdAt: string;
  agentOutputs?: AgentNodeOptions[];
}
import { Injectable, computed, signal } from '@angular/core';
import type {
  AgentNodeOptions,
  AgentRole,
  CanvasView,
  ContextEntryOptions,
} from '../models/pipeline.options';
import type { ArchitectureResultOptions } from '../models/architecture.options';
import type { FileTreeOptions } from '../models/file-tree.options';
import type { SessionOptions } from '../models/session.options';

/**
 * Global UI state container for the AI System Designer.
 * All state is represented as Angular signals; no side-effectful logic here.
 */
@Injectable({ providedIn: 'root' })
export class AppStateService {
  // Canvas
  canvasView = signal<CanvasView>('input');

  // Session
  currentSession = signal<SessionOptions | null>(null);
  sessions = signal<SessionOptions[]>([]);

  // Pipeline
  agentNodes = signal<AgentNodeOptions[]>([]);
  activeAgent = signal<AgentRole | null>(null);
  isStreaming = signal<boolean>(false);
  totalCostSession = signal<number>(0);

  // Streaming
  streamingText = signal<string>('');

  // Context memory
  contextEntries = signal<ContextEntryOptions[]>([]);

  // Artifacts
  architectureResult = signal<ArchitectureResultOptions | null>(null);
  fileTree = signal<FileTreeOptions[]>([]);
  finalOutput = signal<string>('');

  // UI state
  terminalOpen = signal<boolean>(false);
  rightSidenavOpen = signal<boolean>(false);
  leftSidenavOpen = signal<boolean>(true);

  // Computed
  completedAgents = computed(() =>
    this.agentNodes().filter((n) => n.status === 'complete')
  );

  runningAgent = computed(() =>
    this.agentNodes().find((n) => n.status === 'running') ?? null
  );

  pipelineComplete = computed(() =>
    this.agentNodes().length > 0 &&
    this.agentNodes().every(
      (n) => n.status === 'complete' || n.status === 'error'
    )
  );
}

import { Component, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../core/base/base.component';
import { AppStateService } from '../core/services/app-state.service';
import { OrchestratorPort } from '../core/ports/orchestrator.port';
import { ZeroClickInputComponent } from '../zero-click-input/zero-click-input.component';
import { PipelineStatusComponent } from '../pipeline-status/pipeline-status.component';
import { SharedMemoryComponent } from '../shared-memory/shared-memory.component';
import { AiTerminalComponent } from '../ai-terminal/ai-terminal.component';
import { DecimalPipe } from '@angular/common';
import {ArchitectureViewerComponent} from "../architecture-viewer/architecture-viewer.component";
import {FileTreeComponent} from "../file-tree/file-tree.component";
import {FinalOutputComponent} from "../final-output/final-output.component";
import type { FileTreeOptions } from '../core/models/file-tree.options';

import type {
  AgentCompleteData,
  AgentRole,
  AgentStatus,
  ProjectBriefOptions,
  SSEEventOptions,
} from '../core/models/pipeline.options';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    ZeroClickInputComponent,
    PipelineStatusComponent,
    SharedMemoryComponent,
    AiTerminalComponent,
    DecimalPipe,
    ArchitectureViewerComponent,
    FileTreeComponent,
    FinalOutputComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent extends BaseComponent {
  private readonly port = inject(OrchestratorPort);
  readonly state = inject(AppStateService);
  readonly selectedFile = signal<FileTreeOptions | null>(null);

  onFileSelected(file: FileTreeOptions): void {
    this.selectedFile.set(file);
  }

  toggleTerminal(): void {
    this.state.terminalOpen.update(v => !v);
  }

  handleBriefSubmitted(brief: ProjectBriefOptions): void {
    // reset state
    this.state.agentNodes.set([]);
    this.state.activeAgent.set(null);
    this.state.totalCostSession.set(0);
    this.state.streamingText.set('');
    this.state.contextEntries.set([]);
    this.state.architectureResult.set(null);
    this.state.fileTree.set([]);
    this.state.finalOutput.set('');
    this.state.isStreaming.set(false);
    this.state.rightSidenavOpen.set(false);

    this.port.decidePipeline(brief)
      .pipe(takeUntil(this.destroy$))
      .subscribe(run => {
        this.state.agentNodes.set(
          run.pipeline.map(role => ({ role, status: 'waiting' as AgentStatus, model: '' }))
        );
        this.port.streamPipeline(run.sessionId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(event => this.handleSSEEvent(event));
      });
  }

  handleSSEEvent(event: SSEEventOptions): void {
    switch (event.type) {
      case 'agent_start': {
        if (!event.role) return;
        this.state.activeAgent.set(event.role);
        this.state.streamingText.set('');
        this.state.isStreaming.set(true);
        this.state.terminalOpen.set(true);
        this.updateNodeStatus(event.role, 'running');
        if (this.state.canvasView() === 'input') {
          this.state.canvasView.set('execution');
        }
        break;
      }
      case 'agent_chunk': {
        const chunk = (event.data as { chunk: string }).chunk;
        this.state.streamingText.update(t => t + chunk);
        break;
      }
      case 'agent_complete': {
        if (!event.role) return;
        const d = event.data as AgentCompleteData;
        this.updateNodeComplete(event.role, d);
        this.state.contextEntries.update(e => [
          ...e, { role: event.role!, summary: d.summary, keyPoints: d.keyPoints }
        ]);
        this.state.totalCostSession.update(c => c + d.tokenUsage.costUsd);
        this.state.rightSidenavOpen.set(true);
        if (event.role === 'ARCHITECT' && d.architectureResult) {
          this.state.architectureResult.set(d.architectureResult);
          this.state.canvasView.set('architecture');
        }
        if (event.role === 'IMPLEMENTER') {
          if (d.fileTree) this.state.fileTree.set(d.fileTree);
          if (d.finalOutput) this.state.finalOutput.set(d.finalOutput);
        }
        break;
      }
      case 'pipeline_complete': {
        this.state.isStreaming.set(false);
        this.state.canvasView.set('output');
        break;
      }
    }
  }

  private updateNodeStatus(role: AgentRole, status: AgentStatus): void {
    this.state.agentNodes.update(nodes =>
      nodes.map(n => n.role === role ? { ...n, status } : n)
    );
  }

  private updateNodeComplete(role: AgentRole, data: AgentCompleteData): void {
    this.state.agentNodes.update(nodes =>
      nodes.map(n => n.role === role
        ? { ...n, status: 'complete' as AgentStatus, summary: data.summary, keyPoints: data.keyPoints, tokenUsage: data.tokenUsage }
        : n
      )
    );
  }
}
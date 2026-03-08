import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import type { AgentNodeOptions, AgentRole } from '../core/models/pipeline.options';

export const AGENT_META: Record<AgentRole, { icon: string; color: string; label: string }> = {
  ANALYZER:     { icon: 'search',       color: '#64B5F6', label: 'Analyzer'     },
  ARCHITECT:    { icon: 'architecture', color: '#81C784', label: 'Architect'    },
  CODER:        { icon: 'code',         color: '#FFB74D', label: 'Coder'        },
  IMPLEMENTER:  { icon: 'build',        color: '#E57373', label: 'Implementer'  },
  REVIEWER:     { icon: 'rate_review',  color: '#CE93D8', label: 'Reviewer'     },
  ORCHESTRATOR: { icon: 'hub',          color: '#4DB6AC', label: 'Orchestrator' },
};

@Component({
  selector: 'app-pipeline-status',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './pipeline-status.component.html',
  styleUrl: './pipeline-status.component.scss',
})
export class PipelineStatusComponent {
  readonly nodes = input.required<AgentNodeOptions[]>();

  readonly meta = AGENT_META;

  getCostLabel(node: AgentNodeOptions): string {
    return node.tokenUsage ? `$${node.tokenUsage.costUsd.toFixed(4)}` : '';
  }
}

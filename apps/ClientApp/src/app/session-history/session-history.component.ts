import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, DecimalPipe } from '@angular/common';
import type { AgentRole } from '../core/models/pipeline.options';
import type { SessionOptions } from '../core/models/session.options';

const ROLE_ABBR: Record<AgentRole, string> = {
  ORCHESTRATOR: 'OR',
  ANALYZER:     'AN',
  ARCHITECT:    'AR',
  CODER:        'CO',
  IMPLEMENTER:  'IM',
  REVIEWER:     'RE',
};

@Component({
  selector: 'app-session-history',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatChipsModule, DatePipe, DecimalPipe],
  templateUrl: './session-history.component.html',
  styleUrl: './session-history.component.scss',
})
export class SessionHistoryComponent {
  readonly sessions = input.required<SessionOptions[]>();

  readonly sessionSelected = output<SessionOptions>();
  readonly sessionDeleted = output<string>();

  readonly displayedColumns = ['date', 'request', 'pipeline', 'cost', 'status', 'actions'];
  readonly roleAbbr = ROLE_ABBR;

  truncate(text: string, max = 60): string {
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  getRoleAbbr(role: string): string {
  return ROLE_ABBR[role as AgentRole] ?? role.slice(0, 2);
}

}

import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, transition, style, animate } from '@angular/animations';
import type {
  AgentRole,
  ContextEntryOptions,
} from '../core/models/pipeline.options';
import { AGENT_META } from '../pipeline-status/pipeline-status.component';

@Component({
  selector: 'app-shared-memory',
  standalone: true,
  imports: [MatIconModule, MatChipsModule],
  templateUrl: './shared-memory.component.html',
  styleUrl: './shared-memory.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(4px)' }),
        animate(
          '180ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class SharedMemoryComponent {
  readonly entries = input.required<ContextEntryOptions[]>();
  readonly injectingAgent = input<AgentRole | null>(null);

  readonly meta = AGENT_META;
}

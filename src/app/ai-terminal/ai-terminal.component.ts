import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import type { AgentRole } from '../core/models/pipeline.options';
import { BaseComponent } from '../core/base/base.component';
import { signal } from '@angular/core'; // μόνο αν το χρειαστείς αργότερα

@Component({
  selector: 'app-ai-terminal',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './ai-terminal.component.html',
  styleUrl: './ai-terminal.component.scss',
})
export class AiTerminalComponent
  extends BaseComponent
  implements AfterViewChecked
{
  readonly streamText = input.required<string>();
  readonly activeAgent = input<AgentRole | null>(null);
  readonly isOpen = input.required<boolean>();
  readonly isStreaming = input.required<boolean>();

  readonly closeRequested = output<void>();

  @ViewChild('terminalEnd') private terminalEnd?: ElementRef<HTMLDivElement>;

  ngAfterViewChecked(): void {
    if (this.isStreaming() && this.isOpen()) {
      this.terminalEnd?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }
}

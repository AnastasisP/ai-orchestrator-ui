import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { marked } from 'marked';
import hljs from 'highlight.js';
import type { FileTreeOptions } from '../core/models/file-tree.options';

type OutputTab = 'output' | 'file' | 'raw';

@Component({
  selector: 'app-final-output',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './final-output.component.html',
  styleUrl: './final-output.component.scss',
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class FinalOutputComponent {
  readonly content = input.required<string>();
  readonly selectedFile = input<FileTreeOptions | null>(null);

  readonly activeTab = signal<OutputTab>('output');

  @ViewChild('markdownContainer') private markdownContainer?: ElementRef<HTMLDivElement>;

  /** Parsed HTML from marked — updated whenever tab switches to 'output' */
  get parsedHtml(): string {
    return marked.parse(this.content()) as string;
  }

  constructor() {
    // Run highlight.js once after DOM is ready [web:169][web:176]
    afterNextRender(() => {
      this.applyHighlight();
    });
  }

  setTab(tab: OutputTab): void {
    this.activeTab.set(tab);
    // Re-highlight after tab switch settles
    setTimeout(() => this.applyHighlight(), 50);
  }

  copyAll(): void {
    navigator.clipboard.writeText(this.content());
  }

  downloadMd(): void {
    const blob = new Blob([this.content()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  private applyHighlight(): void {
    if (this.markdownContainer?.nativeElement) {
      const blocks = this.markdownContainer.nativeElement.querySelectorAll('pre code');
      blocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }
}
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import type { ProjectBriefOptions } from '../core/models/pipeline.options';

@Component({
  selector: 'app-zero-click-input',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatChipsModule],
  templateUrl: './zero-click-input.component.html',
  styleUrl: './zero-click-input.component.scss',
})
export class ZeroClickInputComponent {
  readonly briefSubmitted = output<ProjectBriefOptions>();

  readonly briefText = signal<string>('');

  readonly examples: string[] = [
    'Build a REST API for user authentication with JWT and refresh tokens',
    'Create a real-time chat system with WebSockets and message persistence',
    'Design a microservice for payment processing with Stripe integration',
    'Build a file upload service with S3 storage and virus scanning',
    'Create a notifications service with email, SMS and push delivery',
  ];

  submit(): void {
    if (!this.briefText().trim()) return;
    this.briefSubmitted.emit({ request: this.briefText().trim() });
    this.briefText.set('');
  }
}

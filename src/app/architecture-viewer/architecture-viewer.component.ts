import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import type {
  ArchitectureResultOptions,
  ComponentOptions,
  TechBadgeOptions,
} from '../core/models/architecture.options';

type ComponentType = ComponentOptions['type'];
type TechCategory = TechBadgeOptions['category'];

const COMPONENT_TYPE_COLORS: Record<ComponentType, string> = {
  controller:  '#9CDCFE',
  service:     '#4EC9B0',
  repository:  '#FFB74D',
  utility:     '#858585',
  middleware:  '#CE93D8',
};

const CATEGORY_LABELS: Record<TechCategory, string> = {
  language:  'Language',
  framework: 'Framework',
  database:  'Database',
  auth:      'Auth',
  infra:     'Infra',
};

@Component({
  selector: 'app-architecture-viewer',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './architecture-viewer.component.html',
  styleUrl: './architecture-viewer.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ArchitectureViewerComponent {
  readonly result = input.required<ArchitectureResultOptions>();

  readonly typeColors = COMPONENT_TYPE_COLORS;
  readonly categoryLabels = CATEGORY_LABELS;

  /** Tech stack grouped by category, computed from signal */
  readonly techByCategory = computed(() => {
    const groups = new Map<TechCategory, TechBadgeOptions[]>();
    for (const tech of this.result().techStack) {
      const list = groups.get(tech.category) ?? [];
      list.push(tech);
      groups.set(tech.category, list);
    }
    return Array.from(groups.entries()).map(([category, items]) => ({
      category,
      label: CATEGORY_LABELS[category],
      items,
    }));
  });
}

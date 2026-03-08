import { Component, OnInit, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import type { FileTreeOptions } from '../core/models/file-tree.options';

export const FILE_ICONS: Record<string, string> = {
  typescript: '🔷',
  javascript: '🟡',
  html:       '🟠',
  css:        '🟣',
  scss:       '🟣',
  json:       '📋',
  markdown:   '📝',
};

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './file-tree.component.html',
  styleUrl: './file-tree.component.scss',
})
export class FileTreeComponent implements OnInit {
  readonly nodes = input.required<FileTreeOptions[]>();
  readonly depth = input<number>(0);

  readonly fileSelected = output<FileTreeOptions>();

  readonly expandedPaths = signal<Set<string>>(new Set());
  readonly fileIcons = FILE_ICONS;

  ngOnInit(): void {
    // Auto-expand root-level folders (depth === 0)
    if (this.depth() === 0) {
      const rootFolders = this.nodes()
        .filter(n => n.type === 'folder')
        .map(n => n.path);
      this.expandedPaths.set(new Set(rootFolders));
    }
  }

  toggleFolder(path: string): void {
    this.expandedPaths.update(set => {
      const next = new Set(set);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  }

  getFileIcon(language?: string): string {
  return FILE_ICONS[language ?? ''] ?? '📄';
}

}

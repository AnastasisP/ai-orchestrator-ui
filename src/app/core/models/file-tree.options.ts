export interface FileTreeOptions {
  name: string;
  path: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileTreeOptions[];
}

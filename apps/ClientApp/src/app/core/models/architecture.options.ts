export interface ArchitectureResultOptions {
  components: ComponentOptions[];
  techStack: TechBadgeOptions[];
  rationale: string;
  dataFlow: string;
}

export interface ComponentOptions {
  name: string;
  type: 'controller' | 'service' | 'repository' | 'utility' | 'middleware';
  description: string;
  dependsOn: string[];
}

export interface TechBadgeOptions {
  name: string;
  category: 'language' | 'framework' | 'database' | 'auth' | 'infra';
  color: string;
}

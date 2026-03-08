import { Injectable } from '@angular/core';
import { Observable, concatMap, delay, from, of } from 'rxjs';
import { OrchestratorPort } from '../ports/orchestrator.port';
import type {
  AgentRole,
  PipelineRunOptions,
  ProjectBriefOptions,
  SSEEventOptions,
} from '../models/pipeline.options';
import type { SessionOptions } from '../models/session.options';

@Injectable()
export class OrchestratorMockService implements OrchestratorPort {
  decidePipeline(brief: ProjectBriefOptions): Observable<PipelineRunOptions> {
    return of({
      sessionId: `mock-${Date.now()}`,
      pipeline: [
        'ANALYZER',
        'ARCHITECT',
        'CODER',
        'IMPLEMENTER',
      ] as AgentRole[],
      estimatedCost: '$0.018',
    }).pipe(delay(900));
  }

  streamPipeline(sessionId: string): Observable<SSEEventOptions> {
    const events: SSEEventOptions[] = [
      { type: 'agent_start', role: 'ANALYZER', data: { model: 'o1-mini' } },
      ...MOCK_CHUNKS.ANALYZER!.map((chunk) => ({
        type: 'agent_chunk' as const,
        role: 'ANALYZER' as const,
        data: { chunk },
      })),
      { type: 'agent_complete', role: 'ANALYZER', data: MOCK_COMPLETE.ANALYZER! },

      { type: 'agent_start', role: 'ARCHITECT', data: { model: 'gpt-4o' } },
      ...MOCK_CHUNKS.ARCHITECT!.map((chunk) => ({
        type: 'agent_chunk' as const,
        role: 'ARCHITECT' as const,
        data: { chunk },
      })),
      {
        type: 'agent_complete',
        role: 'ARCHITECT',
        data: MOCK_COMPLETE.ARCHITECT!,
      },

      { type: 'agent_start', role: 'CODER', data: { model: 'gpt-4o' } },
      ...MOCK_CHUNKS.CODER!.map((chunk) => ({
        type: 'agent_chunk' as const,
        role: 'CODER' as const,
        data: { chunk },
      })),
      { type: 'agent_complete', role: 'CODER', data: MOCK_COMPLETE.CODER! },

      { type: 'agent_start', role: 'IMPLEMENTER', data: { model: 'gpt-4o' } },
      ...MOCK_CHUNKS.IMPLEMENTER!.map((chunk) => ({
        type: 'agent_chunk' as const,
        role: 'IMPLEMENTER' as const,
        data: { chunk },
      })),
      {
        type: 'agent_complete',
        role: 'IMPLEMENTER',
        data: MOCK_COMPLETE.IMPLEMENTER!,
      },

      {
        type: 'pipeline_complete',
        data: { totalCostUsd: 0.0187, totalTokens: 4820 },
      },
    ];

    return from(events).pipe(
      concatMap((event) =>
        of(event).pipe(delay(event.type === 'agent_chunk' ? 120 : 600))
      )
    );
  }

  getSessions(): Observable<SessionOptions[]> {
    return of(MOCK_SESSIONS).pipe(delay(300));
  }

  deleteSession(id: string): Observable<void> {
    return of(undefined as void).pipe(delay(200));
  }
}

// -----------------------------------------------------------------------------
// Mock data
// -----------------------------------------------------------------------------

const MOCK_CHUNKS: Partial<Record<AgentRole, string[]>> = {
  ANALYZER: [
    '[ANALYZER] Reading project brief...\n',
    'Identified core requirements:\n',
    '  → JWT authentication required\n',
    '  → bcrypt for password hashing\n',
    '  → Refresh token rotation strategy\n',
    'Analysis complete. Forwarding to ARCHITECT...\n',
  ],
  ARCHITECT: [
    '[ARCHITECT] Designing system structure...\n',
    'Selected 3-layer architecture:\n',
    '  → AuthController (route handling)\n',
    '  → AuthService (business logic)\n',
    '  → UserRepository (data access)\n',
    'JWT middleware at route level. Forwarding to CODER...\n',
  ],
  CODER: [
    '[CODER] Generating implementation...\n',
    'Writing AuthController...\n',
    'Writing AuthService with bcrypt...\n',
    'Writing JWT utility functions...\n',
    'Code generation complete.\n',
  ],
  IMPLEMENTER: [
    '[IMPLEMENTER] Assembling final deliverable...\n',
    'Creating file structure...\n',
    'Writing README.md...\n',
    'Assembly complete. System ready.\n',
  ],
};

const MOCK_COMPLETE: Partial<Record<AgentRole, any>> = {
  ANALYZER: {
    summary:
      'JWT auth system required with bcrypt password hashing and refresh token rotation.',
    keyPoints: [
      'JWT tokens',
      'bcrypt',
      'refresh token rotation',
      'middleware validation',
    ],
    tokenUsage: { promptTokens: 320, completionTokens: 480, costUsd: 0.0024 },
  },
  ARCHITECT: {
    summary:
      '3-layer architecture: Controller → Service → Repository with JWT middleware at route level.',
    keyPoints: ['3-layer arch', 'AuthController', 'AuthService', 'JWT middleware'],
    tokenUsage: { promptTokens: 580, completionTokens: 720, costUsd: 0.0065 },
    architectureResult: {
      components: [
        {
          name: 'AuthController',
          type: 'controller',
          description: 'Handles login/register/refresh routes',
          dependsOn: ['AuthService'],
        },
        {
          name: 'AuthService',
          type: 'service',
          description: 'Business logic, token generation',
          dependsOn: ['UserRepository', 'JwtUtil'],
        },
        {
          name: 'UserRepository',
          type: 'repository',
          description: 'Database operations for users',
          dependsOn: [],
        },
        {
          name: 'JwtUtil',
          type: 'utility',
          description: 'JWT sign/verify helpers',
          dependsOn: [],
        },
        {
          name: 'AuthMiddleware',
          type: 'middleware',
          description: 'Route-level token validation',
          dependsOn: ['JwtUtil'],
        },
      ],
      techStack: [
        { name: 'TypeScript', category: 'language', color: '#3178C6' },
        { name: 'Node.js', category: 'framework', color: '#339933' },
        { name: 'Express', category: 'framework', color: '#000000' },
        { name: 'SQLite', category: 'database', color: '#003B57' },
        { name: 'JWT', category: 'auth', color: '#D63AFF' },
        { name: 'bcrypt', category: 'auth', color: '#FF6B35' },
      ],
      rationale:
        'Chose 3-layer architecture to separate HTTP concerns from business logic, enabling easy unit testing and future provider swaps.',
      dataFlow:
        'Request → AuthMiddleware → AuthController → AuthService → UserRepository → SQLite',
    },
  },
  CODER: {
    summary:
      'Implemented all auth endpoints with JWT and bcrypt. Error handling included.',
    keyPoints: ['login endpoint', 'register endpoint', 'refresh token', 'error handling'],
    tokenUsage: { promptTokens: 920, completionTokens: 1840, costUsd: 0.0138 },
  },
  IMPLEMENTER: {
    summary: 'Complete project assembled: 6 files, README, ready to run.',
    keyPoints: ['6 files generated', 'README included', 'npm scripts configured'],
    tokenUsage: { promptTokens: 1100, completionTokens: 960, costUsd: 0.0101 },
    fileTree: [
      {
        name: 'src',
        path: 'src',
        type: 'folder',
        children: [
          {
            name: 'controllers',
            path: 'src/controllers',
            type: 'folder',
            children: [
              {
                name: 'auth.controller.ts',
                path: 'src/controllers/auth.controller.ts',
                type: 'file',
                language: 'typescript',
                content: '// AuthController implementation',
              },
            ],
          },
          {
            name: 'services',
            path: 'src/services',
            type: 'folder',
            children: [
              {
                name: 'auth.service.ts',
                path: 'src/services/auth.service.ts',
                type: 'file',
                language: 'typescript',
                content: '// AuthService implementation',
              },
            ],
          },
          {
            name: 'utils',
            path: 'src/utils',
            type: 'folder',
            children: [
              {
                name: 'jwt.util.ts',
                path: 'src/utils/jwt.util.ts',
                type: 'file',
                language: 'typescript',
                content: '// JWT utilities',
              },
            ],
          },
        ],
      },
      {
        name: 'README.md',
        path: 'README.md',
        type: 'file',
        language: 'markdown',
        content:
          '# Auth API\n\nSetup instructions...',
      },
    ],
    finalOutput:
      '# Auth REST API\n\n## Overview\nJWT authentication system...\n\n## Setup\n```bash\nnpm install\nnpm run dev\n```',
  },
};

const MOCK_SESSIONS: SessionOptions[] = [
  {
    id: 'mock-001',
    originalRequest: 'Build REST API for user authentication with JWT',
    status: 'complete',
    pipeline: ['ANALYZER', 'ARCHITECT', 'CODER', 'IMPLEMENTER'],
    totalCostUsd: 0.0187,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    id: 'mock-002',
    originalRequest: 'Fix null pointer exception in payment service',
    status: 'complete',
    pipeline: ['ANALYZER', 'CODER', 'REVIEWER'],
    totalCostUsd: 0.0092,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

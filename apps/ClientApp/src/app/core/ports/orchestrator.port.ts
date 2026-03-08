import { Observable } from 'rxjs';
import type { PipelineRunOptions } from '../models/pipeline.options';
import type { SSEEventOptions } from '../models/pipeline.options';
import type { SessionOptions } from '../models/session.options';
import type { ProjectBriefOptions } from '../models/pipeline.options';

export abstract class OrchestratorPort {
  abstract decidePipeline(brief: ProjectBriefOptions): Observable<PipelineRunOptions>;
  abstract streamPipeline(sessionId: string): Observable<SSEEventOptions>;
  abstract getSessions(): Observable<SessionOptions[]>;
  abstract deleteSession(id: string): Observable<void>;
}

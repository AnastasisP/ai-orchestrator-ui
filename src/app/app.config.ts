import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { OrchestratorPort } from './core/ports/orchestrator.port';
import { OrchestratorMockService } from './core/services/orchestrator.mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    { provide: OrchestratorPort, useClass: OrchestratorMockService },
  ],
};

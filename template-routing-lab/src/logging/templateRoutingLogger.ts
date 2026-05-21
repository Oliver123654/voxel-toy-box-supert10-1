import type {
  FeedbackSignal,
  LogStorageAdapter,
  PromotionEvaluation,
  RankedRetrievalResult,
  RoutingEvaluation,
} from '../contracts/index.js';
import {
  createFeedbackLogEvent,
  createRetrievalLogEvent,
  createRouteLogEvent,
  createTemplatePromotionLogEvent,
} from './events.js';

export class TemplateRoutingLogger {
  constructor(private readonly storage: LogStorageAdapter) {}

  logRetrieval(retrieval: RankedRetrievalResult): void {
    this.storage.append(createRetrievalLogEvent(retrieval));
  }

  logRoute(routing: RoutingEvaluation): void {
    this.storage.append(createRouteLogEvent(routing));
  }

  logFeedback(input: {
    promptMode: RoutingEvaluation['mode'];
    routeDecision: RoutingEvaluation['decision'];
    templateId: string | null;
    feedback: FeedbackSignal;
  }): void {
    this.storage.append(
      createFeedbackLogEvent({
        promptMode: input.promptMode,
        routeDecision: input.routeDecision,
        templateId: input.templateId,
        feedback: input.feedback,
      })
    );
  }

  logTemplatePromotion(evaluation: PromotionEvaluation): void {
    this.storage.append(createTemplatePromotionLogEvent(evaluation));
  }

  listEvents() {
    return this.storage.list();
  }

  clear() {
    this.storage.clear();
  }
}

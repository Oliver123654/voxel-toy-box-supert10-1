import type { PromptMode } from './retrieval.js';
import type { PromotionDecision, PromotionScoreBreakdown } from './promotion.js';
import type { RouteDecision } from './routing.js';
import type { TemplateBaseCategory, TemplateStatus } from './template.js';

export type FeedbackSignal = 'helpful' | 'not_helpful';

export type LogEventType = 'retrieval' | 'route' | 'feedback' | 'template_promotion';

export interface CandidateScoreSnapshot {
  templateId: string;
  score: number;
  matchedSignalTypes: string[];
}

export interface RetrievalLogEvent {
  eventType: 'retrieval';
  createdAt: string;
  promptMode: PromptMode;
  rawPrompt: string;
  normalizedPrompt: string;
  promptTokenCount: number;
  candidateScores: CandidateScoreSnapshot[];
  selectedTemplateId: string | null;
}

export interface RouteLogEvent {
  eventType: 'route';
  createdAt: string;
  promptMode: PromptMode;
  decision: RouteDecision;
  topTemplateId: string | null;
  reasonCodes: string[];
  candidateCount: number;
}

export interface FeedbackLogEvent {
  eventType: 'feedback';
  createdAt: string;
  promptMode: PromptMode;
  routeDecision: RouteDecision;
  templateId: string | null;
  feedback: FeedbackSignal;
}

export interface TemplatePromotionLogEvent {
  eventType: 'template_promotion';
  createdAt: string;
  templateId: string;
  templateName: string;
  category: TemplateBaseCategory;
  fromStatus: TemplateStatus;
  toStatus: TemplateStatus;
  decision: PromotionDecision;
  promotionScore: number;
  scoreBreakdown: PromotionScoreBreakdown;
  geometrySource: string;
  positivePrompts: string[];
  negativePrompts: string[];
  passedChecks: string[];
  failedChecks: string[];
}

export type TemplateRoutingLogEvent =
  | RetrievalLogEvent
  | RouteLogEvent
  | FeedbackLogEvent
  | TemplatePromotionLogEvent;

export interface LogStorageAdapter {
  append(event: TemplateRoutingLogEvent): void;
  list(): TemplateRoutingLogEvent[];
  clear(): void;
}

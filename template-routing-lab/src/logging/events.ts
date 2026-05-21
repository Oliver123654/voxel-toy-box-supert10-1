import type {
  FeedbackLogEvent,
  FeedbackSignal,
  PromotionEvaluation,
  RankedRetrievalResult,
  RetrievalLogEvent,
  RouteLogEvent,
  RoutingEvaluation,
  TemplatePromotionLogEvent,
} from '../contracts/index.js';

export function createRetrievalLogEvent(
  retrieval: RankedRetrievalResult
): RetrievalLogEvent {
  return {
    eventType: 'retrieval',
    createdAt: new Date().toISOString(),
    promptMode: retrieval.mode,
    rawPrompt: retrieval.normalization.rawPrompt,
    normalizedPrompt: retrieval.normalization.normalizedPrompt,
    promptTokenCount: retrieval.normalization.tokens.length,
    candidateScores: retrieval.candidates.map((candidate) => ({
      templateId: candidate.template.metadata.id,
      score: candidate.score,
      matchedSignalTypes: candidate.matchedSignals.map((signal) => signal.type),
    })),
    selectedTemplateId: retrieval.candidates[0]?.template.metadata.id ?? null,
  };
}

export function createRouteLogEvent(
  routing: RoutingEvaluation
): RouteLogEvent {
  return {
    eventType: 'route',
    createdAt: new Date().toISOString(),
    promptMode: routing.mode,
    decision: routing.decision,
    topTemplateId: routing.topCandidate?.template.metadata.id ?? null,
    reasonCodes: routing.reasonCodes,
    candidateCount: routing.candidateTemplates.length,
  };
}

export function createFeedbackLogEvent(input: {
  promptMode: FeedbackLogEvent['promptMode'];
  routeDecision: FeedbackLogEvent['routeDecision'];
  templateId: string | null;
  feedback: FeedbackSignal;
}): FeedbackLogEvent {
  return {
    eventType: 'feedback',
    createdAt: new Date().toISOString(),
    promptMode: input.promptMode,
    routeDecision: input.routeDecision,
    templateId: input.templateId,
    feedback: input.feedback,
  };
}

export function createTemplatePromotionLogEvent(
  evaluation: PromotionEvaluation
): TemplatePromotionLogEvent {
  return {
    eventType: 'template_promotion',
    createdAt: evaluation.createdAt,
    templateId: evaluation.templateId,
    templateName: evaluation.templateName,
    category: evaluation.category,
    fromStatus: evaluation.fromStatus,
    toStatus: evaluation.toStatus,
    decision: evaluation.decision,
    promotionScore: evaluation.totalScore,
    scoreBreakdown: evaluation.scoreBreakdown,
    geometrySource: evaluation.geometry.sourceRef,
    positivePrompts: evaluation.positiveChecks.map((check) => check.prompt),
    negativePrompts: evaluation.negativeChecks.map((check) => check.prompt),
    passedChecks: evaluation.passedChecks,
    failedChecks: evaluation.failedChecks,
  };
}

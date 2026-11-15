import type { MediaCandidate } from "./media-candidates";

export type ReviewResult = {
  wholePlantVisible: boolean;
  multipleAngles: boolean;
  growthStageKnown: boolean;
  trainingKnown: boolean;
  scaleKnown: boolean;
  sourceAttributed: boolean;
  identityEvidence: boolean;
  reusePermission: boolean;
};

export function evaluateReference(candidate: MediaCandidate, review: ReviewResult) {
  const morphologyScore =
    (review.wholePlantVisible ? 35 : 0) +
    (review.multipleAngles ? 20 : 0) +
    (review.growthStageKnown ? 15 : 0) +
    (review.trainingKnown ? 15 : 0) +
    (review.scaleKnown ? 15 : 0);
  const provenanceScore =
    (review.sourceAttributed ? 40 : 0) +
    (review.identityEvidence ? 60 : 0);
  const canPublishImage = review.reusePermission && candidate.rights !== "unverified";
  return {
    morphologyScore,
    provenanceScore,
    suitableForStructure: review.wholePlantVisible && morphologyScore >= 60,
    canPublishImage,
    warnings: [
      ...(!review.wholePlantVisible ? ["No verified full-plant view"] : []),
      ...(!review.identityEvidence ? ["Cultivar identity not substantiated"] : []),
      ...(!canPublishImage ? ["Image reuse rights not established"] : [])
    ]
  };
}

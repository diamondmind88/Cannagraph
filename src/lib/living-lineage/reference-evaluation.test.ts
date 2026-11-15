import { describe, expect, it } from "vitest";
import { evaluateReference } from "./reference-evaluation";
import { sourDieselMediaCandidates } from "./media-candidates";

const candidate = sourDieselMediaCandidates[0];
const review = {
  wholePlantVisible: true, multipleAngles: true, growthStageKnown: true,
  trainingKnown: true, scaleKnown: true, sourceAttributed: true,
  identityEvidence: false, reusePermission: false
};

describe("reference evaluation", () => {
  it("scores useful morphology without mistaking it for cultivar proof", () => {
    const result = evaluateReference(candidate, review);
    expect(result.morphologyScore).toBe(100);
    expect(result.provenanceScore).toBe(40);
    expect(result.suitableForStructure).toBe(true);
    expect(result.canPublishImage).toBe(false);
  });

  it("rejects closeups as full-plant structure references", () => {
    const result = evaluateReference(candidate, { ...review, wholePlantVisible: false });
    expect(result.suitableForStructure).toBe(false);
    expect(result.warnings).toContain("No verified full-plant view");
  });

  it("does not grant publication rights based on permission claim alone", () => {
    expect(evaluateReference(candidate, { ...review, reusePermission: true }).canPublishImage).toBe(false);
  });
});

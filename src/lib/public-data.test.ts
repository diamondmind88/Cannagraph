import { describe, expect, it } from "vitest";

import type { PublicEntity } from "@/lib/public-data";

describe("public data contracts", () => {
  it("keeps the public identity shape explicit", () => {
    const entity: PublicEntity = {
      canonicalName: "Archive specimen",
      description: null,
      entityType: "cultivar",
      id: "00000000-0000-0000-0000-000000000000",
      publicId: "CNG-CUL-00000001",
      publishedAt: null,
      slug: "archive-specimen",
    };

    expect(entity.publicId).toMatch(/^CNG-CUL-/);
    expect(entity.description).toBeNull();
  });
});

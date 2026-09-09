import { describe, expect, it } from "vitest";
import { parsePublicEnvironment } from "./env";

describe("parsePublicEnvironment", () => {
  it("accepts browser-safe Supabase configuration", () => {
    const result = parsePublicEnvironment({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example_key_12345",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
    expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
  });

  it("rejects missing configuration", () => {
    expect(() => parsePublicEnvironment({})).toThrow();
  });

  it("rejects non-HTTPS Supabase URLs", () => {
    expect(() => parsePublicEnvironment({
      NEXT_PUBLIC_SUPABASE_URL: "http://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example_key_12345",
    })).toThrow("Supabase URL must use HTTPS");
  });
});

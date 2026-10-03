import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/public-data", () => ({getPublicLineageNeighborhood: vi.fn()}));
import { getPublicLineageNeighborhood } from "./public-data";
import { GET } from "@/app/api/lineage/[entityId]/route";
const id = "11111111-1111-4111-8111-111111111111";
const request = (entityId=id, query="") => GET(new Request(`https://cannagraph.test/api/lineage/${entityId}${query}`), {params:Promise.resolve({entityId})});
beforeEach(() => { vi.mocked(getPublicLineageNeighborhood).mockReset(); });
describe("lineage expansion endpoint", () => {
  it("rejects invalid IDs and limits before querying", async () => {
    expect((await request("invalid")).status).toBe(400);
    for(const query of ["?limit=0", "?limit=21", "?limit=NaN", "?limit=1.5"]) expect((await request(id, query)).status).toBe(400);
    expect(getPublicLineageNeighborhood).not.toHaveBeenCalled();
  });
  it("returns 404 for records outside public visibility", async () => {
    vi.mocked(getPublicLineageNeighborhood).mockResolvedValue(null);
    expect((await request()).status).toBe(404);
  });
  it("returns bounded data without shared caching of cookie-aware responses", async () => {
    const data = {focusId:id,nodes:[],edges:[],truncated:false,evidenceTruncated:false};
    vi.mocked(getPublicLineageNeighborhood).mockResolvedValue(data);
    const response=await request(id,"?limit=7");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(data);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(getPublicLineageNeighborhood).toHaveBeenCalledWith(id,7);
  });
  it("reports failures without exposing database details", async () => {
    vi.mocked(getPublicLineageNeighborhood).mockRejectedValue(new Error("Internal connection detail"));
    const response=await request();
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("Internal connection detail");
  });
});

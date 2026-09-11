import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicLineageNeighborhood } from "@/lib/public-data";

const paramsSchema=z.object({entityId:z.string().uuid()});
const querySchema=z.object({limit:z.coerce.number().int().min(1).max(20).default(12)});

export async function GET(request:Request,{params}:{params:Promise<{entityId:string}>}){
 const parsedParams=paramsSchema.safeParse(await params);if(!parsedParams.success)return NextResponse.json({error:"Invalid entity identifier"},{status:400});
 const url=new URL(request.url);const parsedQuery=querySchema.safeParse({limit:url.searchParams.get("limit")??12});if(!parsedQuery.success)return NextResponse.json({error:"Invalid expansion limit"},{status:400});
 try{const neighborhood=await getPublicLineageNeighborhood(parsedParams.data.entityId,parsedQuery.data.limit);if(!neighborhood)return NextResponse.json({error:"Public entity not found"},{status:404});return NextResponse.json(neighborhood,{headers:{"Cache-Control":"public, max-age=60, stale-while-revalidate=300"}});}catch{ return NextResponse.json({error:"Unable to load lineage neighborhood"},{status:500}); }
}

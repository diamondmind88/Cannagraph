import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().refine((value) => value.startsWith("https://"), "Supabase URL must use HTTPS"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20, "Supabase publishable key is missing"),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
});

export type PublicEnvironment = z.infer<typeof publicEnvironmentSchema>;

export function parsePublicEnvironment(environment: Record<string, string | undefined>): PublicEnvironment {
  return publicEnvironmentSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: environment.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: environment.NEXT_PUBLIC_APP_URL,
  });
}

export function getPublicEnvironment(): PublicEnvironment {
  return parsePublicEnvironment(process.env);
}

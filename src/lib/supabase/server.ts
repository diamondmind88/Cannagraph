import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnvironment } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const environment = getPublicEnvironment();

  return createServerClient(environment.NEXT_PUBLIC_SUPABASE_URL, environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. Middleware/auth actions will own refresh later.
        }
      },
    },
  });
}

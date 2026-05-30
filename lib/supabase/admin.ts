import { createClient } from "@supabase/supabase-js";

// Server-side admin client without Database generic to avoid
// TypeScript inference collapsing to 'never' on union-typed columns.
// All query results are explicitly cast to proper types at call sites.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

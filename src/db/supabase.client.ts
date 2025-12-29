import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "../db/database.types.ts";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_KEY;

// Client-side Supabase using SSR package for cookie-based auth
export const supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

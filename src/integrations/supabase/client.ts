import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://jicolpebujylglegwppj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY29scGVidWp5bGdsZWd3cHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDcxNjgsImV4cCI6MjA2MzMyMzE2OH0.FXUow13qFMrlEE1sPwdTsN8d4oVX5xKQS3fWTUUacqY";

export const supabase = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_PUBLISHABLE_KEY,
	{
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			storageKey: "postcraft-auth-token",
		},
	}
);

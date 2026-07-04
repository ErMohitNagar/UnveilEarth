import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xpdeyecxefnpvjbbuvfb.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZGV5ZWN4ZWZucHZqYmJ1dmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDQ5NzksImV4cCI6MjA5ODcyMDk3OX0.lpLdofi3G7k8CqDWgq8msSWBATEH_M5oKZCebBRPT4A"
  );
}

/**
 * Phase 2 smoke test — verifies Supabase URL, service role key, and survey_responses table.
 * Usage: npm run test:supabase
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    throw new Error(".env.local not found. Copy .env.local.example and fill in your keys.");
  }

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const TEST_ANSWERS = {
  _test: true,
  note: "Phase 2 connection test — safe to delete",
};

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");

  console.log("1/4 Connecting to Supabase…");
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("2/4 Inserting test row…");
  const { data: inserted, error: insertError } = await supabase
    .from("survey_responses")
    .insert({ answers: TEST_ANSWERS })
    .select("id, created_at")
    .single();

  if (insertError) {
    console.error("\nInsert failed:", insertError.message);
    if (insertError.message.includes("survey_responses")) {
      console.error("\nHint: Run supabase/migrations/001_create_survey_responses.sql in the SQL Editor.");
    }
    process.exit(1);
  }

  console.log("3/4 Reading test row back…");
  const { data: fetched, error: fetchError } = await supabase
    .from("survey_responses")
    .select("id, answers")
    .eq("id", inserted.id)
    .single();

  if (fetchError || !fetched) {
    console.error("\nRead failed:", fetchError?.message ?? "Row not found");
    process.exit(1);
  }

  console.log("4/4 Cleaning up test row…");
  await supabase.from("survey_responses").delete().eq("id", inserted.id);

  console.log("\nPhase 2 passed.");
  console.log(`  Table: survey_responses`);
  console.log(`  Test id: ${inserted.id}`);
  console.log(`  Service role key: working`);
}

main().catch((err) => {
  console.error("\nPhase 2 test failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

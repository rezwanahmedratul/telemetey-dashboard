import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// Shared secret expected from the PowerShell agent (?key=...)
const TELEMETRY_KEY = process.env.TELEMETRY_KEY ?? "chomolokko"

// Service-role client bypasses RLS so unauthenticated agents can insert.
function getAdminClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function parseTelemetryTime(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null
  // The agent sends "yyyy-MM-dd HH:mm:ss" (local time). Treat as UTC-ish parse.
  const normalized = value.includes("T") ? value : value.replace(" ", "T")
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export async function POST(request: NextRequest) {
  // 1. Validate shared secret
  const key = request.nextUrl.searchParams.get("key")
  if (key !== TELEMETRY_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Parse JSON body (agent may send text/plain or application/json)
  let body: Record<string, unknown>
  try {
    const raw = await request.text()
    body = raw ? JSON.parse(raw) : {}
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // 3. Map agent fields -> table columns
  const record = {
    ip: typeof body.ip === "string" ? body.ip : null,
    hostname: typeof body.hostname === "string" ? body.hostname : null,
    user_name: typeof body.user === "string" ? body.user : null,
    os: typeof body.os === "string" ? body.os : null,
    cpu: typeof body.cpu === "string" ? body.cpu : null,
    ram: typeof body.ram === "string" ? body.ram : null,
    disk: typeof body.disk === "string" ? body.disk : null,
    telemetry_time: parseTelemetryTime(body.time) ?? new Date().toISOString(),
  }

  // 4. Insert
  const supabase = getAdminClient()
  const { error } = await supabase.from("computers").insert(record)

  if (error) {
    console.log("[v0] telemetry insert error:", error.message)
    return NextResponse.json({ error: "Failed to store telemetry" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// Optional: allow a simple GET health check
export async function GET() {
  return NextResponse.json({ status: "telemetry endpoint ready" })
}

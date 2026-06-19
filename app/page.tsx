import { Dashboard } from "@/components/dashboard/dashboard"
import { createClient } from "@/lib/supabase/server"
import type { Computer } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("computers").select("*").order("id", { ascending: false })

  if (error) {
    console.log("[v0] Failed to load telemetry:", error.message)
  }

  const computers = (data ?? []) as Computer[]

  return <Dashboard computers={computers} />
}

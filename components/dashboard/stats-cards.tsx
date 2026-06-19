"use client"

import { motion } from "framer-motion"
import { Clock, Database, Globe, Server } from "lucide-react"
import type { Computer } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { useMounted } from "@/lib/use-mounted"

interface StatsCardsProps {
  computers: Computer[]
}

function formatDate(value: string | null, mounted: boolean) {
  if (!value) return "—"
  const d = new Date(value)
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // Use UTC for SSR + first client render so hydration matches,
    // then switch to the user's local timezone once mounted.
    timeZone: mounted ? undefined : "UTC",
  })
}

export function StatsCards({ computers }: StatsCardsProps) {
  const mounted = useMounted()
  const totalRecords = computers.length
  const uniqueHostnames = new Set(computers.map((c) => c.hostname).filter(Boolean)).size
  const uniqueIps = new Set(computers.map((c) => c.ip).filter(Boolean)).size
  const latest = computers.reduce<string | null>((acc, c) => {
    const t = c.telemetry_time ?? c.created_at
    if (!t) return acc
    if (!acc || new Date(t) > new Date(acc)) return t
    return acc
  }, null)

  const stats = [
    { label: "Total Records", value: totalRecords.toLocaleString(), icon: Database },
    { label: "Unique Hostnames", value: uniqueHostnames.toLocaleString(), icon: Server },
    { label: "Unique IP Addresses", value: uniqueIps.toLocaleString(), icon: Globe },
    { label: "Latest Submission", value: formatDate(latest, mounted), icon: Clock },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
        >
          <Card className="group relative overflow-hidden border-border/60 bg-card/60 p-5 backdrop-blur transition-all hover:border-border hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 truncate text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

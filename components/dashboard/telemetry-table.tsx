"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, SearchX } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { Computer } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface TelemetryTableProps {
  rows: Computer[]
}

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function IpCell({ ip }: { ip: string | null }) {
  const [copied, setCopied] = useState(false)

  if (!ip) return <span className="text-muted-foreground">—</span>

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ip)
      setCopied(true)
      toast.success("IP address copied", { description: ip })
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Failed to copy IP address")
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy IP address ${ip}`}
      className="group/ip inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-sm transition-colors hover:bg-accent"
    >
      <span>{ip}</span>
      <span className="text-muted-foreground opacity-0 transition-opacity group-hover/ip:opacity-100">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  )
}

export function TelemetryTable({ rows }: TelemetryTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/40 px-6 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">No records found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 backdrop-blur">
      <div className="max-h-[calc(100vh-22rem)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="border-border/60 bg-card/95 backdrop-blur hover:bg-card/95">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Hostname</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Operating System</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>RAM</TableHead>
              <TableHead>Disk</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.025, 0.2), ease: "easeOut" }}
                  className={cn(
                    "border-b border-border/40 transition-colors hover:bg-accent/60",
                    i % 2 === 1 && "bg-muted/30",
                  )}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {row.id}
                  </TableCell>
                  <TableCell>
                    <IpCell ip={row.ip} />
                  </TableCell>
                  <TableCell className="font-medium">{row.hostname ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{row.user_name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="rounded-md border-border/50 bg-secondary/60 font-normal"
                    >
                      {row.os ?? "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.cpu ?? "—"}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{row.ram ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{row.disk ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-right text-xs text-muted-foreground tabular-nums">
                    {formatDate(row.telemetry_time ?? row.created_at)}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

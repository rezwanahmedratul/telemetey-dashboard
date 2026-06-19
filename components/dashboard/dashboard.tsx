"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import type { Computer } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Navbar } from "./navbar"
import { StatsCards } from "./stats-cards"
import { TelemetryTable } from "./telemetry-table"

const PAGE_SIZE = 10

interface DashboardProps {
  computers: Computer[]
}

export function Dashboard({ computers }: DashboardProps) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return computers
    return computers.filter((c) =>
      [c.hostname, c.ip, c.user_name].some((field) => field?.toLowerCase().includes(q)),
    )
  }, [computers, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar query={query} onQueryChange={handleQueryChange} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Telemetry Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Computers that have executed the installation script, sorted by most recent.
          </p>
        </div>

        <div className="mb-8">
          <StatsCards computers={computers} />
        </div>

        <TelemetryTable rows={pageRows} />

        {filtered.length > 0 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{start + 1}</span>–
              <span className="font-medium text-foreground">{Math.min(start + PAGE_SIZE, filtered.length)}</span> of{" "}
              <span className="font-medium text-foreground">{filtered.length}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-border/60 bg-background/40 backdrop-blur"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="px-2 text-sm tabular-nums text-muted-foreground">
                Page <span className="font-medium text-foreground">{currentPage}</span> of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-border/60 bg-background/40 backdrop-blur"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

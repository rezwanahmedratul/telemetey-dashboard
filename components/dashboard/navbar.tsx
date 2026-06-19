"use client"

import { Activity, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./theme-toggle"

interface NavbarProps {
  query: string
  onQueryChange: (value: string) => void
}

export function Navbar({ query, onQueryChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Activity className="h-5 w-5" />
          </div>
          <span className="hidden text-base font-semibold tracking-tight sm:inline-block">
            Telemetry Dashboard
          </span>
        </div>

        <div className="relative ml-auto w-full max-w-xs sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search host, IP, or user…"
            aria-label="Search telemetry records"
            className="h-9 rounded-lg border-border/60 bg-background/40 pl-9 backdrop-blur"
          />
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}

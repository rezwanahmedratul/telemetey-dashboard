export interface Computer {
  id: number
  created_at: string
  ip: string | null
  hostname: string | null
  user_name: string | null
  os: string | null
  cpu: string | null
  ram: string | null
  disk: string | null
  telemetry_time: string | null
}

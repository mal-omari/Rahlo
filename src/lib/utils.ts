import type { AvailabilityLevel, CampsiteResult } from '@/types'

export function formatDriveTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m away`
  const h = Math.floor(minutes / 60), m = minutes % 60
  return m === 0 ? `${h}h away` : `${h}h ${m}m away`
}

export function classifyAvailability(count: number): AvailabilityLevel {
  if (count === 0) return 'none'
  if (count <= 3) return 'urgent'
  if (count <= 10) return 'low'
  return 'high'
}

export function buildBookingUrl(ontarioParksId: string, resourceLocationId: string, checkIn: string, checkOut: string, partySize: number): string {
  const params = new URLSearchParams({ mapId: ontarioParksId, resourceLocationId, startDate: checkIn, endDate: checkOut, partySize: String(partySize) })
  return `https://reservations.ontarioparks.ca/#/create-booking/results?${params.toString()}`
}

export type SortKey = 'urgency' | 'distance' | 'price'

export function sortResults(results: CampsiteResult[], key: SortKey): CampsiteResult[] {
  const urgencyOrder: Record<AvailabilityLevel, number> = { urgent: 0, low: 1, high: 2, none: 3 }
  return [...results].sort((a, b) => {
    if (key === 'urgency') return urgencyOrder[a.availabilityLevel] - urgencyOrder[b.availabilityLevel]
    if (key === 'distance') return a.driveMinutes - b.driveMinutes
    return a.pricePerNight - b.pricePerNight
  })
}

export function toISODate(d: Date): string { return d.toISOString().split('T')[0] }

export function formatDisplayDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

export function nextFriday(): string {
  const d = new Date(), day = d.getDay()
  d.setDate(d.getDate() + ((5 - day + 7) % 7 || 7))
  return toISODate(d)
}

export function nextSunday(): string {
  const d = new Date(), day = d.getDay()
  d.setDate(d.getDate() + ((7 - day) % 7 || 7))
  return toISODate(d)
}

export type SiteType = 'tent' | 'rv' | 'yurt' | 'cabin'
export type SiteFeature = 'waterfront' | 'electrical' | 'pet-friendly' | 'accessible' | 'flush-toilets' | 'showers' | 'fire-pit'
export type AvailabilityLevel = 'high' | 'low' | 'urgent' | 'none'

export interface CampsiteResult {
  id: string; parkId: string; parkName: string; siteName: string; region: string
  driveMinutes: number; pricePerNight: number; availableCount: number
  availabilityLevel: AvailabilityLevel; features: SiteFeature[]; siteType: SiteType
  bookingUrl: string; ontarioParksId: string; resourceLocationId: string
}

export interface SearchFilters {
  region: string; checkIn: string; checkOut: string
  siteTypes: SiteType[]; features: SiteFeature[]; partySize: number; maxPrice?: number
}

export const AVAILABILITY_CONFIG: Record<AvailabilityLevel, { label: (n: number) => string; bgClass: string; textClass: string; dotClass: string }> = {
  high:   { label: n => `${n} left`, bgClass: 'bg-[#EAF3DE]', textClass: 'text-[#3B6D11]', dotClass: 'bg-[#639922]' },
  low:    { label: n => `${n} left`, bgClass: 'bg-[#FAEEDA]', textClass: 'text-[#854F0B]', dotClass: 'bg-[#EF9F27]' },
  urgent: { label: n => `${n} left`, bgClass: 'bg-[#FAECE7]', textClass: 'text-[#993C1D]', dotClass: 'bg-[#E8622A]' },
  none:   { label: () => 'Fully booked', bgClass: 'bg-[#F0F6E8]', textClass: 'text-[#6B8558]', dotClass: 'bg-[#B8D288]' },
}

export const FEATURE_CONFIG: Record<SiteFeature, { label: string; emoji: string }> = {
  'waterfront':    { label: 'Waterfront',   emoji: '🌊' },
  'electrical':    { label: 'Electrical',   emoji: '⚡' },
  'pet-friendly':  { label: 'Pet friendly', emoji: '🐾' },
  'accessible':    { label: 'Accessible',   emoji: '♿' },
  'flush-toilets': { label: 'Flush toilets',emoji: '🚽' },
  'showers':       { label: 'Showers',      emoji: '🚿' },
  'fire-pit':      { label: 'Fire pit',     emoji: '🔥' },
}

export const SITE_TYPE_CONFIG: Record<SiteType, { label: string; emoji: string }> = {
  tent:  { label: 'Tent',        emoji: '⛺' },
  rv:    { label: 'RV / trailer',emoji: '🚐' },
  yurt:  { label: 'Yurt',        emoji: '🏕️' },
  cabin: { label: 'Cabin',       emoji: '🪵' },
}

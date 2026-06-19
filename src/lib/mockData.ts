import type { CampsiteResult } from '@/types'
import { classifyAvailability } from '@/lib/utils'

function r(p: Omit<CampsiteResult, 'availabilityLevel'>): CampsiteResult {
  return { ...p, availabilityLevel: classifyAvailability(p.availableCount) }
}

export const mockResults: CampsiteResult[] = [
  r({ id:'sandbanks-1', parkId:'2074', parkName:'Sandbanks', siteName:'Dunes Wilderness', region:'Prince Edward County', driveMinutes:165, pricePerNight:52, availableCount:2, features:['waterfront','pet-friendly','showers'], siteType:'tent', bookingUrl:'', ontarioParksId:'-2147483524', resourceLocationId:'-2147483510' }),
  r({ id:'presquile-1', parkId:'2064', parkName:"Presqu'ile", siteName:'Lakeshore', region:'Brighton', driveMinutes:115, pricePerNight:44, availableCount:8, features:['waterfront','pet-friendly','fire-pit','accessible'], siteType:'tent', bookingUrl:'', ontarioParksId:'-2147483576', resourceLocationId:'-2147483560' }),
  r({ id:'macgregor-1', parkId:'2082', parkName:'MacGregor Point', siteName:'Georgian Bay', region:'Southampton', driveMinutes:140, pricePerNight:38, availableCount:24, features:['pet-friendly','fire-pit','showers'], siteType:'tent', bookingUrl:'', ontarioParksId:'-2147483480', resourceLocationId:'-2147483470' }),
  r({ id:'killarney-1', parkId:'2070', parkName:'Killarney', siteName:'Silver Lake', region:'Killarney', driveMinutes:290, pricePerNight:48, availableCount:1, features:['waterfront','fire-pit'], siteType:'tent', bookingUrl:'', ontarioParksId:'-2147483566', resourceLocationId:'-2147483558' }),
  r({ id:'wasaga-1', parkId:'2058', parkName:'Wasaga Beach', siteName:'Main Beach', region:'Wasaga Beach', driveMinutes:95, pricePerNight:56, availableCount:5, features:['waterfront','showers','electrical','pet-friendly'], siteType:'tent', bookingUrl:'', ontarioParksId:'-2147483612', resourceLocationId:'-2147483600' }),
]

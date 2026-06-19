/**
 * Ontario Parks Availability API Client
 *
 * Wraps the internal CAMIS reservation API used by reservations.ontarioparks.ca
 * All booking is done via direct links to Ontario Parks — this client is read-only.
 *
 * Endpoints discovered via network analysis on 2026-06-18.
 */

import { randomUUID } from "crypto";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "https://reservations.ontarioparks.ca/api";

const DEFAULT_HEADERS = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  "app-language": "en-CA",
  "app-version": "5.110.210",
  "cache-control": "no-cache",
  "content-type": "application/json",
  pragma: "no-cache",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParkSession {
  cartUid: string;
  bookingUid: string;
  cookies: string;
}

export interface SiteAvailability {
  resourceId: number;
  availability: number; // 0 = unavailable, 1 = available, 2 = restricted, 5 = walk-in
  remainingQuota: number | null;
}

export interface MapAvailabilityResponse {
  mapId: number;
  mapAvailabilities: number[];
  resourceAvailabilities: Record<string, SiteAvailability[]>;
  mapLinkAvailabilities: Record<string, unknown>;
}

export interface DailyAvailability {
  processedAvailability: number;
  availability: number;
  remainingQuota: number | null;
}

export interface AvailabilitySearchParams {
  mapId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  partySize?: number;
  equipmentCategoryId?: number;
  subEquipmentCategoryId?: number;
}

export interface AvailableSite {
  resourceId: number;
  mapId: number;
  parkName: string;
  startDate: string;
  endDate: string;
  bookingUrl: string;
}

// ─── Session Management ───────────────────────────────────────────────────────

/**
 * Establishes a session with Ontario Parks to get the required XSRF cookie.
 * Must be called before any availability checks.
 */
export async function createSession(): Promise<ParkSession> {
  const response = await fetch(BASE_URL.replace("/api", ""), {
    method: "GET",
    headers: DEFAULT_HEADERS,
    redirect: "follow",
  });

  // Extract cookies from Set-Cookie headers
  const setCookieHeader = response.headers.get("set-cookie") ?? "";
  const xsrfMatch = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
  const antiforgeryMatch = setCookieHeader.match(
    /\.AspNetCore\.Antiforgery\.[^=]+=([^;]+)/
  );

  const cookies = [
    xsrfMatch ? `XSRF-TOKEN=${xsrfMatch[1]}` : "",
    antiforgeryMatch ? `.AspNetCore.Antiforgery.3YREhQdkuHQ=${antiforgeryMatch[1]}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  return {
    cartUid: randomUUID(),
    bookingUid: randomUUID(),
    cookies,
  };
}

// ─── Core API Calls ───────────────────────────────────────────────────────────

/**
 * Fetches availability for all sites within a campground loop (map).
 * This is the primary endpoint for monitoring — one call returns every site.
 *
 * @returns Map of resourceId (as string) → availability array
 */
export async function getMapAvailability(
  params: AvailabilitySearchParams,
  session: ParkSession
): Promise<MapAvailabilityResponse> {
  const {
    mapId,
    startDate,
    endDate,
    partySize = 2,
    equipmentCategoryId = -32768,
    subEquipmentCategoryId = -32768,
  } = params;

  const peopleCapacity = JSON.stringify([
    {
      capacityCategoryId: -32768,
      subCapacityCategoryId: null,
      count: partySize,
    },
  ]);

  const query = new URLSearchParams({
    mapId: String(mapId),
    bookingCategoryId: "0",
    equipmentCategoryId: String(equipmentCategoryId),
    subEquipmentCategoryId: String(subEquipmentCategoryId),
    cartUid: session.cartUid,
    cartTransactionUid: randomUUID(),
    bookingUid: session.bookingUid,
    groupHoldUid: "",
    startDate,
    endDate,
    getDailyAvailability: "false",
    isReserving: "true",
    filterData: "[]",
    boatLength: "0",
    boatDraft: "0",
    boatWidth: "0",
    peopleCapacityCategoryCounts: peopleCapacity,
    numEquipment: "0",
    seed: new Date().toISOString(),
  });

  const response = await fetch(
    `${BASE_URL}/availability/map?${query.toString()}`,
    {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        cookie: session.cookies,
        referer: "https://reservations.ontarioparks.ca/",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Map availability request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<MapAvailabilityResponse>;
}

/**
 * Fetches day-by-day availability for a single campsite.
 * Use this after getMapAvailability to get the detailed breakdown for a specific site.
 */
export async function getSiteDailyAvailability(
  resourceId: number,
  startDate: string,
  endDate: string,
  session: ParkSession,
  partySize = 2
): Promise<DailyAvailability[]> {
  const peopleCapacity = JSON.stringify([
    {
      capacityCategoryId: -32768,
      subCapacityCategoryId: null,
      count: partySize,
    },
  ]);

  const query = new URLSearchParams({
    cartUid: session.cartUid,
    resourceId: String(resourceId),
    bookingCategoryId: "0",
    startDate,
    endDate,
    isReserving: "true",
    equipmentCategoryId: "-32768",
    subEquipmentCategoryId: "-32768",
    boatLength: "0",
    boatDraft: "0",
    boatWidth: "0",
    peopleCapacityCategoryCounts: peopleCapacity,
    numEquipment: "0",
    filterData: "[]",
    groupHoldUid: "",
    bookingUid: session.bookingUid,
  });

  const response = await fetch(
    `${BASE_URL}/availability/resourcedailyavailability?${query.toString()}`,
    {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        cookie: session.cookies,
        referer: "https://reservations.ontarioparks.ca/",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Daily availability request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<DailyAvailability[]>;
}

/**
 * Fetches all campground maps for a given park.
 * Returns the list of mapIds (campground loops) within that park.
 */
export async function getParkMaps(resourceLocationId: number) {
  const response = await fetch(
    `${BASE_URL}/maps?resourceLocationId=${resourceLocationId}`,
    {
      method: "GET",
      headers: DEFAULT_HEADERS,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Park maps request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ─── High-Level Helper ────────────────────────────────────────────────────────

/**
 * Main entry point: checks availability across an entire park for given dates.
 * Returns only the sites that are available (availability === 1).
 *
 * Usage:
 *   const session = await createSession();
 *   const available = await getAvailableSites({
 *     mapIds: [-2147483573, -2147482980],  // Algonquin Brent CG1 + CG2
 *     parkName: "Algonquin - Brent",
 *     startDate: "2026-07-11",
 *     endDate: "2026-07-13",
 *   }, session);
 */
/**
 * Main entry point: checks availability across an entire park for given dates.
 * Returns only the sites that are available (availability === 1).
 *
 * transactionLocationId and resourceLocationId are the park-level IDs from
 * parks-registry.json — required to build working booking URLs. mapIds are
 * the campground loop(s) within that park to check.
 *
 * Usage:
 *   const session = await createSession();
 *   const available = await getAvailableSites({
 *     transactionLocationId: -2147483630,
 *     resourceLocationId: -2147483631,
 *     mapIds: [-2147483573],  // Algonquin Brent CG1
 *     parkName: "Algonquin - Brent",
 *     startDate: "2026-07-11",
 *     endDate: "2026-07-13",
 *   }, session);
 */
export async function getAvailableSites(
  params: {
    transactionLocationId: number;
    resourceLocationId: number;
    mapIds: number[];
    parkName: string;
    startDate: string;
    endDate: string;
    partySize?: number;
  },
  session: ParkSession
): Promise<AvailableSite[]> {
  const {
    transactionLocationId,
    resourceLocationId,
    mapIds,
    parkName,
    startDate,
    endDate,
    partySize = 2,
  } = params;
  const available: AvailableSite[] = [];

  for (const mapId of mapIds) {
    const result = await getMapAvailability(
      { mapId, startDate, endDate, partySize },
      session
    );

    // One booking URL per map loop — same for every site in that loop,
    // since the results page links to the campground map, not a single site.
    const bookingUrl = buildBookingUrl({
      transactionLocationId,
      resourceLocationId,
      mapId,
      startDate,
      endDate,
      partySize,
    });

    for (const [resourceId, availabilityArr] of Object.entries(
      result.resourceAvailabilities
    )) {
      // Check if available for the full requested range
      const isAvailable = availabilityArr.every((a) => a.availability === 1);

      if (isAvailable) {
        available.push({
          resourceId: Number(resourceId),
          mapId,
          parkName,
          startDate,
          endDate,
          bookingUrl,
        });
      }
    }

    // Rate limit — be polite to the server
    await delay(500);
  }

  return available;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Builds a direct booking URL for a specific park/campground + date range.
 * Users click this to go straight to the Ontario Parks results page for
 * that campground, with the correct dates pre-filled.
 *
 * Matches the captured working pattern:
 *   /create-booking/results?transactionLocationId=...&resourceLocationId=...
 *     &mapId=...&startDate=...&endDate=...&nights=...
 *
 * NOTE: The results page does not accept a resourceId/site param — it loads
 * the whole campground map for the given dates. There is no documented way
 * to deep-link to one specific site, so we link to the map and let the user
 * pick the open site themselves (we tell them which site number to look for
 * in the UI).
 *
 * transactionLocationId and resourceLocationId come from parks-registry.json
 * (per-park, not per-site) — pass them in from whichever park record the
 * site belongs to.
 */
export function buildBookingUrl(params: {
  transactionLocationId: number;
  resourceLocationId: number;
  mapId: number;
  startDate: string;
  endDate: string;
  partySize: number;
}): string {
  const {
    transactionLocationId,
    resourceLocationId,
    mapId,
    startDate,
    endDate,
    partySize,
  } = params;

  const nights = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const peopleCapacity = encodeURIComponent(
    JSON.stringify([[-32768, null, partySize, null]])
  );

  return (
    `https://reservations.ontarioparks.ca/create-booking/results` +
    `?transactionLocationId=${transactionLocationId}` +
    `&resourceLocationId=${resourceLocationId}` +
    `&mapId=${mapId}` +
    `&searchTabGroupId=0` +
    `&bookingCategoryId=0` +
    `&startDate=${startDate}` +
    `&endDate=${endDate}` +
    `&nights=${nights}` +
    `&isReserving=true` +
    `&equipmentId=-32768` +
    `&subEquipmentId=-32768` +
    `&peopleCapacityCategoryCounts=${peopleCapacity}`
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Availability Value Reference ─────────────────────────────────────────────
//
// availability === 0  → Not available / booked
// availability === 1  → Available — this is what we alert on
// availability === 2  → Available with restrictions (partial dates, etc.)
// availability === 5  → Walk-in only / no advance reservation

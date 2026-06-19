/**
 * Ontario Parks Availability Monitor
 *
 * Runs as a Supabase Edge Function on a schedule.
 * Checks availability, compares to last snapshot, fires alerts on new openings.
 */

import {
  createSession,
  getAvailableSites,
  type AvailableSite,
} from "./ontario-parks-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MonitoredSearch {
  id: string;               // Supabase row ID
  userId: string;
  parkName: string;
  transactionLocationId: number; // park-level ID, from parks-registry.json
  resourceLocationId: number;    // park-level ID, from parks-registry.json
  mapIds: number[];
  startDate: string;
  endDate: string;
  partySize: number;
  alertEmail: string;
  lastSnapshot: string[];   // resourceIds that were available at last check
}

export interface NewOpening {
  search: MonitoredSearch;
  site: AvailableSite;
}

// ─── Core Monitor Logic ───────────────────────────────────────────────────────

/**
 * Checks a single monitored search for new availability.
 * Returns any sites that are newly available since the last snapshot.
 */
export async function checkForNewOpenings(
  search: MonitoredSearch
): Promise<NewOpening[]> {
  const session = await createSession();

  const currentlyAvailable = await getAvailableSites(
    {
      transactionLocationId: search.transactionLocationId,
      resourceLocationId: search.resourceLocationId,
      mapIds: search.mapIds,
      parkName: search.parkName,
      startDate: search.startDate,
      endDate: search.endDate,
      partySize: search.partySize,
    },
    session
  );

  // Find sites that weren't in the last snapshot
  const lastSnapshotSet = new Set(search.lastSnapshot);
  const newOpenings = currentlyAvailable.filter(
    (site) => !lastSnapshotSet.has(String(site.resourceId))
  );

  return newOpenings.map((site) => ({ search, site }));
}

/**
 * Runs the full monitoring cycle across all active searches.
 * Called by the Supabase Edge Function on schedule.
 *
 * @param searches - Active monitored searches from Supabase
 * @param onNewOpening - Callback to handle each new opening (send alert, update snapshot)
 */
export async function runMonitoringCycle(
  searches: MonitoredSearch[],
  onNewOpening: (opening: NewOpening) => Promise<void>
): Promise<{ checked: number; newOpenings: number; errors: string[] }> {
  const errors: string[] = [];
  let newOpeningsCount = 0;

  for (const search of searches) {
    try {
      const openings = await checkForNewOpenings(search);

      for (const opening of openings) {
        await onNewOpening(opening);
        newOpeningsCount++;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`Search ${search.id}: ${message}`);
      console.error(`Monitor error for search ${search.id}:`, err);
    }

    // Stagger requests — don't hammer the server
    await delay(1000);
  }

  return {
    checked: searches.length,
    newOpenings: newOpeningsCount,
    errors,
  };
}

// ─── Snapshot Utilities ───────────────────────────────────────────────────────

/**
 * Converts a list of available sites to a snapshot array of resourceId strings.
 * Store this in Supabase after each check to enable diff detection.
 */
export function buildSnapshot(sites: AvailableSite[]): string[] {
  return sites.map((s) => String(s.resourceId));
}

/**
 * Compares two snapshots and returns the newly available resourceIds.
 */
export function diffSnapshots(
  previous: string[],
  current: string[]
): string[] {
  const previousSet = new Set(previous);
  return current.filter((id) => !previousSet.has(id));
}

// ─── Supabase Edge Function Entry Point ──────────────────────────────────────
//
// This will live at: supabase/functions/availability-monitor/index.ts
//
// Deno.serve(async () => {
//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//   );
//
//   // Fetch all active searches from DB
//   const { data: searches } = await supabase
//     .from("monitored_searches")
//     .select("*")
//     .eq("active", true)
//     .gte("end_date", new Date().toISOString().split("T")[0]);
//
//   const results = await runMonitoringCycle(
//     searches as MonitoredSearch[],
//     async (opening) => {
//       // 1. Send email via Resend
//       await sendAlertEmail(opening);
//
//       // 2. Update snapshot in Supabase
//       const newSnapshot = buildSnapshot(
//         await getAvailableSites(...)
//       );
//       await supabase
//         .from("monitored_searches")
//         .update({ last_snapshot: newSnapshot })
//         .eq("id", opening.search.id);
//
//       // 3. Log alert to alert_history table
//       await supabase.from("alert_history").insert({
//         search_id: opening.search.id,
//         user_id: opening.search.userId,
//         resource_id: opening.site.resourceId,
//         park_name: opening.site.parkName,
//         start_date: opening.site.startDate,
//         end_date: opening.site.endDate,
//         booking_url: opening.site.bookingUrl,
//         alerted_at: new Date().toISOString(),
//       });
//     }
//   );
//
//   return new Response(JSON.stringify(results), {
//     headers: { "Content-Type": "application/json" },
//   });
// });

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

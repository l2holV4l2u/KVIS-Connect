import { LandingClient } from "./LandingClient";
import type { GlobePin, Summary } from "@/lib/types";

// Revalidate every 5 minutes — alumni data changes slowly
export const revalidate = 300;

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getPins(): Promise<GlobePin[]> {
  try {
    const res = await fetch(`${API}/api/users/globe/pins`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getSummary(): Promise<Summary | null> {
  try {
    const res = await fetch(`${API}/api/summary`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [pins, summary] = await Promise.all([getPins(), getSummary()]);

  return <LandingClient initialPins={pins} initialSummary={summary} />;
}

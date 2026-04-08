import { Suspense } from "react";
import { LandingClient } from "./LandingClient";

export default function HomePage() {
  return (
    <Suspense>
      <LandingClient />
    </Suspense>
  );
}

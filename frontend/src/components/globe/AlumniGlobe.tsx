"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { GlobePin } from "@/lib/types";
import { useRouter } from "next/navigation";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface AlumniGlobeProps {
  pins: GlobePin[];
}

interface AggPin {
  lat: number;
  lng: number;
  count: number;
  users: GlobePin[];
  label: string;
}

function clusterPins(pins: GlobePin[], threshold = 3): AggPin[] {
  const clusters: AggPin[] = [];
  const used = new Set<number>();

  pins.forEach((pin, i) => {
    if (used.has(i)) return;
    const cluster: GlobePin[] = [pin];
    used.add(i);

    pins.forEach((other, j) => {
      if (used.has(j)) return;
      const dlat = Math.abs(pin.latitude - other.latitude);
      const dlng = Math.abs(pin.longitude - other.longitude);
      if (dlat < threshold && dlng < threshold) {
        cluster.push(other);
        used.add(j);
      }
    });

    const lat = cluster.reduce((s, p) => s + p.latitude, 0) / cluster.length;
    const lng = cluster.reduce((s, p) => s + p.longitude, 0) / cluster.length;
    clusters.push({
      lat, lng,
      count: cluster.length,
      users: cluster,
      label: cluster.length === 1
        ? `${cluster[0].first_name} ${cluster[0].last_name}`
        : `${cluster.length} alumni`,
    });
  });
  return clusters;
}

export default function AlumniGlobe({ pins }: AlumniGlobeProps) {
  const globeRef = useRef<any>(null);
  const router = useRouter();
  const [dims, setDims] = useState({ w: 600, h: 500 });
  const clusters = clusterPins(pins);

  useEffect(() => {
    const el = document.getElementById("globe-container");
    if (el) setDims({ w: el.clientWidth, h: el.clientHeight });
    const handleResize = () => {
      if (el) setDims({ w: el.clientWidth, h: el.clientHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.4;
    }
  }, []);

  const handlePointClick = useCallback((point: object) => {
    const p = point as AggPin;
    if (p.count === 1) {
      router.push(`/profile/${p.users[0].user_id}`);
    } else {
      const firstUser = p.users[0];
      router.push(`/search?country=${encodeURIComponent(firstUser.place ?? "")}`);
    }
  }, [router]);

  return (
    <div id="globe-container" className="w-full h-full">
      <Globe
        ref={globeRef}
        width={dims.w}
        height={dims.h}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={clusters}
        pointLat="lat"
        pointLng="lng"
        pointColor={(p: object) => {
          const point = p as AggPin;
          return point.count > 5 ? "#f97316" : point.count > 1 ? "#3b82f6" : "#22c55e";
        }}
        pointAltitude={0.02}
        pointRadius={(p: object) => {
          const point = p as AggPin;
          return Math.min(0.4 + point.count * 0.08, 1.2);
        }}
        pointLabel={(p: object) => {
          const point = p as AggPin;
          return `<div class="bg-background/90 backdrop-blur border rounded-md px-3 py-2 text-sm font-medium shadow-lg">
            <div class="font-semibold">${point.label}</div>
            ${point.count > 1 ? `<div class="text-xs text-muted-foreground">${point.users[0].place ?? ""}</div>` : `<div class="text-xs text-muted-foreground">Gen ${point.users[0].kvis_year ?? "?"}</div>`}
          </div>`;
        }}
        onPointClick={handlePointClick}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}

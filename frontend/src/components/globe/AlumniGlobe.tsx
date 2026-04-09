"use client";
import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobePin } from "@/lib/types";
import { useRouter } from "next/navigation";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface AlumniGlobeProps {
  pins: GlobePin[];
  filteredPins?: GlobePin[];
}

// ── Single global hover card (avoids per-pin DOM leak) ──────────────────────
let globalCard: HTMLElement | null = null;

function getGlobalCard(): HTMLElement {
  if (globalCard && document.body.contains(globalCard)) return globalCard;

  const card = document.createElement("div");
  card.id = "__kvis_hover_card";
  card.style.cssText = `
    position:fixed;
    width:220px;
    background:rgba(2,8,28,0.97);
    backdrop-filter:blur(14px);
    border:1px solid rgba(59,130,246,0.4);
    border-radius:14px;
    padding:12px;
    pointer-events:none;
    opacity:0;
    transition:opacity 0.15s;
    box-shadow:0 8px 32px rgba(0,0,0,0.9);
    font-family:system-ui,sans-serif;
    z-index:99999;
    top:0;left:0;
  `;
  document.body.appendChild(card);
  globalCard = card;
  return card;
}

function populateCard(card: HTMLElement, pin: GlobePin) {
  const initials = `${pin.first_name?.[0] ?? ""}${pin.last_name?.[0] ?? ""}`.toUpperCase();
  card.innerHTML = "";

  // Top row
  const topRow = document.createElement("div");
  topRow.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:8px;";

  const av = document.createElement("div");
  av.style.cssText = `
    width:42px;height:42px;border-radius:50%;
    border:2px solid #3b82f6;background:#1e3a5f;overflow:hidden;
    flex-shrink:0;display:flex;align-items:center;justify-content:center;
    font-size:13px;font-weight:700;color:white;
  `;
  if (pin.profile_pic_url) {
    const img = document.createElement("img");
    img.src = pin.profile_pic_url;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    img.onerror = () => { img.remove(); av.textContent = initials; };
    av.appendChild(img);
  } else {
    av.textContent = initials;
  }

  const nameCol = document.createElement("div");
  nameCol.style.cssText = "min-width:0;";
  nameCol.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:white;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
      ${pin.first_name} ${pin.last_name}
    </div>
    <div style="font-size:11px;color:#94a3b8;margin-top:2px;">
      ${[pin.kvis_year ? `Gen ${pin.kvis_year}` : null, pin.country].filter(Boolean).join(" · ")}
    </div>
  `;

  topRow.appendChild(av);
  topRow.appendChild(nameCol);
  card.appendChild(topRow);

  const hr = document.createElement("div");
  hr.style.cssText = "height:1px;background:rgba(255,255,255,0.08);margin-bottom:8px;";
  card.appendChild(hr);

  if (pin.current_job) {
    const el = document.createElement("div");
    el.style.cssText = "font-size:11px;color:#cbd5e1;margin-bottom:5px;display:flex;align-items:flex-start;gap:5px;";
    const safe = pin.current_job.replace(/</g, "&lt;");
    el.innerHTML = `<span style="flex-shrink:0;">💼</span><span style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${safe}</span>`;
    card.appendChild(el);
  }

  if (pin.place) {
    const el = document.createElement("div");
    el.style.cssText = "font-size:11px;color:#cbd5e1;margin-bottom:5px;display:flex;align-items:center;gap:5px;";
    const safe = pin.place.replace(/</g, "&lt;");
    el.innerHTML = `<span>📍</span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${safe}</span>`;
    card.appendChild(el);
  }

  if (pin.mbti) {
    const el = document.createElement("div");
    el.style.cssText = `
      display:inline-block;margin-top:4px;padding:2px 8px;border-radius:20px;
      background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);
      font-size:10px;font-weight:700;color:#93c5fd;letter-spacing:0.05em;
    `;
    el.textContent = pin.mbti;
    card.appendChild(el);
  }
}

function makePinEl(pin: GlobePin, router: ReturnType<typeof useRouter>): HTMLElement {
  const initials = `${pin.first_name?.[0] ?? ""}${pin.last_name?.[0] ?? ""}`.toUpperCase();

  const wrap = document.createElement("div");
  wrap.style.cssText = "cursor:pointer;display:flex;align-items:center;justify-content:center;pointer-events:auto;";

  const avatar = document.createElement("div");
  avatar.style.cssText = `
    width:54px;height:54px;border-radius:50%;
    border:3px solid #3b82f6;
    background:#1e3a5f;
    overflow:hidden;
    display:flex;align-items:center;justify-content:center;
    font-size:15px;font-weight:700;color:white;
    font-family:system-ui,sans-serif;
    box-shadow:0 3px 14px rgba(0,0,0,0.75);
    transition:transform 0.15s,border-color 0.15s,box-shadow 0.15s;
    user-select:none;
  `;

  if (pin.profile_pic_url) {
    const img = document.createElement("img");
    img.src = pin.profile_pic_url;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    img.onerror = () => { img.remove(); avatar.textContent = initials; };
    avatar.appendChild(img);
  } else {
    avatar.textContent = initials;
  }

  wrap.addEventListener("mouseover", (e) => {
    e.stopPropagation();
    const card = getGlobalCard();
    populateCard(card, pin);

    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cardLeft = Math.max(8, Math.min(cx - 110, window.innerWidth - 228));

    card.style.left = `${cardLeft}px`;
    card.style.top = `${rect.top - 8}px`;
    card.style.transform = "translateY(-100%)";
    card.style.opacity = "1";

    avatar.style.transform = "scale(1.18)";
    avatar.style.borderColor = "#60a5fa";
    avatar.style.boxShadow = "0 0 18px rgba(96,165,250,0.6)";
  });

  wrap.addEventListener("mouseout", (e) => {
    e.stopPropagation();
    const card = getGlobalCard();
    card.style.opacity = "0";
    avatar.style.transform = "scale(1)";
    avatar.style.borderColor = "#3b82f6";
    avatar.style.boxShadow = "0 3px 14px rgba(0,0,0,0.75)";
  });

  wrap.addEventListener("click", () => router.push(`/profile/${pin.user_id}`));

  wrap.appendChild(avatar);
  return wrap;
}

const COUNTRY_URL = "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";
const PROVINCE_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson";
const CITIES_URL = "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_populated_places_simple.geojson";

interface LabelPoint { lat: number; lng: number; name: string; tier: "country" | "province" | "city"; pop?: number; }

export default function AlumniGlobe({ pins, filteredPins }: AlumniGlobeProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [altitude, setAltitude] = useState(2.5);
  const [countryFeatures, setCountryFeatures] = useState<any[]>([]);
  const [provinceFeatures, setProvinceFeatures] = useState<any[]>([]);
  const [countryLabels, setCountryLabels] = useState<LabelPoint[]>([]);
  const [provinceLabels, setProvinceLabels] = useState<LabelPoint[]>([]);
  const [cityLabels, setCityLabels] = useState<LabelPoint[]>([]);
  const [provincesLoaded, setProvincesLoaded] = useState(false);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  // Fetch country borders + labels once
  useEffect(() => {
    fetch(COUNTRY_URL).then(r => r.json()).then(d => {
      const features = d.features ?? [];
      setCountryFeatures(features);
      setCountryLabels(
        features
          .filter((f: any) => f.properties?.LABEL_X != null && f.properties?.LABEL_Y != null)
          .map((f: any) => ({
            lat: f.properties.LABEL_Y,
            lng: f.properties.LABEL_X,
            name: f.properties.NAME ?? f.properties.ADMIN ?? "",
            tier: "country" as const,
          }))
      );
    });
  }, []);

  // Lazy-load province borders + labels when zoomed in
  useEffect(() => {
    if (altitude < 1.2 && !provincesLoaded) {
      setProvincesLoaded(true);
      fetch(PROVINCE_URL).then(r => r.json()).then(d => {
        const features = d.features ?? [];
        setProvinceFeatures(features);
        setProvinceLabels(
          features
            .filter((f: any) => f.properties?.LABEL_X != null && f.properties?.LABEL_Y != null)
            .map((f: any) => ({
              lat: f.properties.LABEL_Y,
              lng: f.properties.LABEL_X,
              name: f.properties.name ?? f.properties.NAME ?? "",
              tier: "province" as const,
            }))
        );
      });
    }
  }, [altitude, provincesLoaded]);

  // Lazy-load city labels when zoomed in more
  useEffect(() => {
    if (altitude < 0.8 && !citiesLoaded) {
      setCitiesLoaded(true);
      fetch(CITIES_URL).then(r => r.json()).then(d => {
        setCityLabels(
          (d.features ?? [])
            .filter((f: any) => (f.properties?.pop_max ?? 0) > 300_000)
            .map((f: any) => ({
              lat: f.properties.latitude ?? f.geometry?.coordinates?.[1],
              lng: f.properties.longitude ?? f.geometry?.coordinates?.[0],
              name: f.properties.name ?? f.properties.NAME ?? "",
              tier: "city" as const,
              pop: f.properties.pop_max,
            }))
        );
      });
    }
  }, [altitude, citiesLoaded]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    const handler = () => {
      const pov = globeRef.current?.pointOfView();
      if (pov) setAltitude(pov.altitude);
    };
    controls.addEventListener("change", handler);
    return () => controls.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    if (!filteredPins || filteredPins.length === 0) {
      if (filteredPins !== undefined) return;
      globeRef.current.controls().autoRotate = true;
      return;
    }
    const lat = filteredPins.reduce((s, p) => s + p.latitude, 0) / filteredPins.length;
    const lng = filteredPins.reduce((s, p) => s + p.longitude, 0) / filteredPins.length;
    const alt = filteredPins.length === 1 ? 1.2 : filteredPins.length < 5 ? 1.8 : 2.5;
    globeRef.current.controls().autoRotate = false;
    globeRef.current.pointOfView({ lat, lng, altitude: alt }, 1200);
  }, [filteredPins]);

  const showProvinces = altitude < 1.2 && provinceFeatures.length > 0;
  const polygonsData = showProvinces
    ? [...countryFeatures, ...provinceFeatures]
    : countryFeatures;

  // Build label list based on zoom level
  const labelsData: LabelPoint[] = [
    ...countryLabels,
    ...(altitude < 1.2 ? provinceLabels : []),
    ...(altitude < 0.8 ? cityLabels : []),
  ];

  const displayPins = filteredPins !== undefined ? filteredPins : pins;

  return (
    <div ref={containerRef} className="w-full h-full">
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        // ── Borders ──
        polygonsData={polygonsData}
        polygonGeoJsonGeometry={(f: any) => f.geometry}
        polygonCapColor={() => "transparent"}
        polygonSideColor={() => "transparent"}
        polygonStrokeColor={(f: any) =>
          f.properties?.scalerank !== undefined
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0.25)"
        }
        polygonAltitude={0.001}
        // ── Labels ──
        labelsData={labelsData}
        labelLat={(d: object) => (d as LabelPoint).lat}
        labelLng={(d: object) => (d as LabelPoint).lng}
        labelText={(d: object) => (d as LabelPoint).name}
        labelSize={(d: object) => {
          const tier = (d as LabelPoint).tier;
          return tier === "country" ? 0.55 : tier === "province" ? 0.35 : 0.25;
        }}
        labelColor={(d: object) => {
          const tier = (d as LabelPoint).tier;
          return tier === "country"
            ? "rgba(255,255,255,0.85)"
            : tier === "province"
            ? "rgba(255,255,255,0.55)"
            : "rgba(255,220,100,0.75)";
        }}
        labelDotRadius={0}
        labelAltitude={0.002}
        labelResolution={2}
        // ── Pins ──
        htmlElementsData={displayPins}
        htmlLat={(p: object) => (p as GlobePin).latitude}
        htmlLng={(p: object) => (p as GlobePin).longitude}
        htmlElement={(p: object) => makePinEl(p as GlobePin, router)}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}

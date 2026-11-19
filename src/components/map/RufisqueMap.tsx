"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  ECO_KIOSKS,
  WASTE_CATEGORIES,
  type WasteReport,
  type EcoKiosk,
} from "@/lib/mock-data";

interface RufisqueMapProps {
  reports: WasteReport[];
  selectedReportId?: string;
  onSelectReport?: (report: WasteReport) => void;
  heightClass?: string;
}

export function RufisqueMap({
  reports,
  selectedReportId,
  onSelectReport,
  heightClass = "h-[340px]",
}: RufisqueMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "kiosks"
  >("all");
  const [selectedKiosk, setSelectedKiosk] = useState<EcoKiosk | null>(null);

  const filteredReports = reports.filter((r) => {
    if (filter === "kiosks") return false;
    if (filter === "active") return r.status !== "completed";
    if (filter === "completed") return r.status === "completed";
    return true;
  });

  const showKiosks = filter === "all" || filter === "kiosks";

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [14.7215, -17.2685],
          zoom: 13,
          zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      }

      const layerGroup = markersLayerRef.current;
      if (!layerGroup) return;
      layerGroup.clearLayers();

      filteredReports.forEach((rep) => {
        const isDone = rep.status === "completed";
        const isUrgent = !isDone && rep.urgency === "critique";
        const isSelected = rep.id === selectedReportId;

        const dotClass = [
          "cc-dot",
          isDone ? "cc-dot-done" : isUrgent ? "cc-dot-urgent" : "",
          isSelected ? "is-selected" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const icon = L.divIcon({
          className: "cc-marker",
          html: `<div class="cc-dot-wrap"><span class="${dotClass}"></span></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([rep.lat, rep.lng], { icon });
        marker.on("click", () => {
          setSelectedKiosk(null);
          onSelectReport?.(rep);
        });
        marker.bindTooltip(
          `${rep.quartier} · ${WASTE_CATEGORIES[rep.category].label}`,
          { direction: "top", offset: [0, -8] }
        );
        marker.addTo(layerGroup);
      });

      if (showKiosks) {
        ECO_KIOSKS.forEach((kiosk) => {
          const icon = L.divIcon({
            className: "cc-marker",
            html: `<div class="cc-dot-wrap"><span class="cc-dot cc-dot-kiosk"></span></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([kiosk.lat, kiosk.lng], { icon });
          marker.on("click", () => {
            setSelectedKiosk(kiosk);
          });
          marker.bindTooltip(kiosk.name, { direction: "top", offset: [0, -8] });
          marker.addTo(layerGroup);
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [filteredReports, showKiosks, selectedReportId, onSelectReport]);

  return (
    <div className="rounded-card bg-surface border border-line overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">Carte de Rufisque</span>

        <div className="flex items-center gap-1">
          {(
            [
              { id: "all", label: "Tous" },
              { id: "active", label: "En cours" },
              { id: "completed", label: "Traités" },
              { id: "kiosks", label: "Points de tri" },
            ] as const
          ).map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`h-8 px-3 rounded-full text-xs transition-colors ${
                  active
                    ? "bg-ink text-surface font-medium"
                    : "text-muted hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`relative w-full ${heightClass} bg-subtle`}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {selectedKiosk ? (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-20 p-3.5 rounded-field bg-surface border border-line shadow-lift text-xs space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-semibold text-ink">
                {selectedKiosk.name}
              </strong>
              <button
                type="button"
                onClick={() => setSelectedKiosk(null)}
                className="text-muted hover:text-ink"
              >
                Fermer
              </button>
            </div>
            <p className="text-muted">{selectedKiosk.openHours}</p>
            <p className="text-accent font-medium">
              {selectedKiosk.bonusMultiplier}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

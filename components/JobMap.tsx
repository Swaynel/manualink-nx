"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function JobMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mapInstance.current = L.map(mapRef.current).setView([-1.2921, 36.8219], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    const locations = [
      {
        lat: -1.2921,
        lng: 36.8219,
        title: "Construction Worker Needed",
        location: "Nairobi",
        pay: 1500,
        payPeriod: "daily",
      },
      {
        lat: -0.3031,
        lng: 36.08,
        title: "Farm Hand Wanted",
        location: "Nakuru",
        pay: 1200,
        payPeriod: "daily",
      },
      {
        lat: -4.0435,
        lng: 39.6682,
        title: "Office Cleaning",
        location: "Mombasa",
        pay: 800,
        payPeriod: "daily",
      },
      {
        lat: -1.1714,
        lng: 36.8355,
        title: "Gardener Needed",
        location: "Kiambu",
        pay: 1000,
        payPeriod: "daily",
      },
    ];

    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng]).addTo(mapInstance.current);
      marker.bindPopup(`
        <b>${location.title}</b><br>
        ${location.location}<br>
        KSH ${location.pay}/${location.payPeriod}<br>
        <button class="map-btn" data-id="1">View Details</button>
      `);
    });

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  return (
    <section className="job-map" aria-labelledby="map-heading">
      <div className="container">
        <h2 id="map-heading">Jobs Near You</h2>
        <div ref={mapRef} id="map" aria-label="Map showing job locations" />
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function JobMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Initialize map only on client side
    if (typeof window !== 'undefined') {
      mapInstance.current = L.map('map').setView([-1.2921, 36.8219], 6); // Center on Kenya
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstance.current);

      // Add sample markers (in a real app, these would come from your database)
      const locations = [
        { lat: -1.2921, lng: 36.8219, title: 'Construction Worker Needed', location: 'Nairobi', pay: 1500, payPeriod: 'daily' },
        { lat: -0.3031, lng: 36.0800, title: 'Farm Hand Wanted', location: 'Nakuru', pay: 1200, payPeriod: 'daily' },
        { lat: -4.0435, lng: 39.6682, title: 'Office Cleaning', location: 'Mombasa', pay: 800, payPeriod: 'daily' },
        { lat: -1.1714, lng: 36.8355, title: 'Gardener Needed', location: 'Kiambu', pay: 1000, payPeriod: 'daily' }
      ];

      locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(mapInstance.current);
        marker.bindPopup(`
          <b>${loc.title}</b><br>
          ${loc.location}<br>
          KSH ${loc.pay}/${loc.payPeriod}<br>
          <button class="map-btn" data-id="1">View Details</button>
        `);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  return (
    <section className="job-map" aria-labelledby="map-heading">
      <div className="container">
        <h2 id="map-heading">Jobs Near You</h2>
        <div id="map" aria-label="Map showing job locations"></div>
      </div>
    </section>
  );
}
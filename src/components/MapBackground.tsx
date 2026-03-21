import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Compass, Layers } from 'lucide-react';

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

export const MapBackground = ({ children, location = "mumbai" }: { children?: React.ReactNode, location?: string }) => {
  const coords: Record<string, [number, number]> = {
    mumbai: [19.0760, 72.8777],
    london: [51.5074, -0.1278],
    seattle: [47.6062, -122.3321],
  };

  const center = coords[location.toLowerCase()] || coords.mumbai;

  return (
    <div className="absolute inset-0 z-0 bg-surface-container-low overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full grayscale opacity-60"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        {children}
      </MapContainer>
      
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-surface pointer-events-none z-10" />
      
      {/* Mock Map UI Elements */}
      <div className="absolute top-24 right-6 z-20 flex flex-col gap-3">
        <button className="w-12 h-12 bg-surface-container-lowest rounded-xl shadow-md flex items-center justify-center text-primary active:scale-95 transition-transform">
          <Compass size={24} />
        </button>
        <button className="w-12 h-12 bg-surface-container-lowest rounded-xl shadow-md flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform">
          <Layers size={24} />
        </button>
      </div>
    </div>
  );
};

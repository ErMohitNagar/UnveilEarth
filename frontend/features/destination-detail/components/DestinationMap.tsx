"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DestinationMapProps {
  longitude: number;
  latitude: number;
}

export function DestinationMap({ longitude, latitude }: DestinationMapProps) {
  const [viewState, setViewState] = useState({
    longitude,
    latitude,
    zoom: 12
  });

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-muted border flex items-center justify-center flex-col p-6 text-center">
        <MapPin className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">Mapbox Token Required</p>
        <p className="text-sm text-muted-foreground max-w-sm mt-2">
          Set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables to see the interactive map.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border shadow-sm">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-2 border-background">
            <MapPin className="h-6 w-6" />
          </div>
        </Marker>
      </Map>
    </div>
  );
}

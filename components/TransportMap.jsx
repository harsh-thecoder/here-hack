"use client";

import React, { useEffect, useRef, useState } from "react";

export default function TransportMap({ airportPosition, hotelPosition, homePosition }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const platform = new H.service.Platform({
      apikey: process.env.NEXT_PUBLIC_HERE_API_KEY,
    });

    const defaultLayers = platform.createDefaultLayers();
    const mapInstance = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      zoom: 10,
      center: hotelPosition,
    });

    new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
    H.ui.UI.createDefault(mapInstance, defaultLayers);

    setMap(mapInstance);

    return () => mapInstance.dispose();
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear previous objects
    map.getObjects().forEach((obj) => map.removeObject(obj));

    // Add markers
    const airportMarker = new H.map.Marker(airportPosition);
    const hotelMarker = new H.map.Marker(hotelPosition);
    const homeMarker = new H.map.Marker(homePosition);

    map.addObject(airportMarker);
    map.addObject(hotelMarker);
    map.addObject(homeMarker);

    // Add mock polylines (airport to hotel)
    const lineAirportToHotel = new H.map.Polyline(
      new H.geo.LineString([airportPosition, hotelPosition]),
      { style: { strokeColor: "#20B2AA", lineWidth: 4 } }
    );

    // Add mock polylines (home to airport)
    const lineHomeToAirport = new H.map.Polyline(
      new H.geo.LineString([homePosition, airportPosition]),
      { style: { strokeColor: "#FFD700", lineWidth: 4, lineDash: [10, 6] } }
    );

    map.addObject(lineAirportToHotel);
    map.addObject(lineHomeToAirport);

    // Adjust viewport to show all points
    const bbox = new H.geo.Rect(
      Math.min(airportPosition.lat, hotelPosition.lat, homePosition.lat),
      Math.min(airportPosition.lng, hotelPosition.lng, homePosition.lng),
      Math.max(airportPosition.lat, hotelPosition.lat, homePosition.lat),
      Math.max(airportPosition.lng, hotelPosition.lng, homePosition.lng)
    );
    map.getViewModel().setLookAtData({ bounds: bbox });
  }, [map, airportPosition, hotelPosition, homePosition]);

  return <div ref={mapRef} style={{ width: "100%", height: "300px" }} className="rounded-md shadow-lg border border-[#E5E5E5]" />;
}

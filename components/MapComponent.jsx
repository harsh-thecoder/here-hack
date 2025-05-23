"use client";

import { useEffect, useRef, useState } from 'react';

export default function MapComponent() {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [uiInstance, setUiInstance] = useState(null);
  const [marker, setMarker] = useState(null);
  const [bubble, setBubble] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const platform = new H.service.Platform({
      apikey: process.env.NEXT_PUBLIC_HERE_API_KEY,
    });

    const defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      zoom: 2,
      center: { lat: 20, lng: 0 },
    });

    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    map.addEventListener("tap", function (evt) {
      const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      handleLocationSelection(coord);
    });

    setMapInstance(map);
    setUiInstance(ui);

    return () => map.dispose();
  }, []);

  const handleLocationSelection = (position) => {
    if (marker) {
      mapInstance.removeObject(marker);
      uiInstance.removeBubble(bubble);
    }

    const tempMarker = new H.map.Marker(position);
    mapInstance.addObject(tempMarker);
    setMarker(tempMarker);
    mapInstance.setCenter(position);
    mapInstance.setZoom(14);

    const bubbleContent = document.createElement("div");
    bubbleContent.innerHTML = `
      <div style="padding: 8px;">
        <p class="text-sm"><strong>Latitude:</strong> ${position.lat.toFixed(5)}</p>
        <p class="text-sm"><strong>Longitude:</strong> ${position.lng.toFixed(5)}</p>
        <button id="confirmBtn" class="mt-2 px-4 py-2 text-white bg-[#20B2AA] hover:bg-[#1A2E44] rounded-lg text-sm">Confirm Destination</button>
      </div>
    `;

    const newBubble = new H.ui.InfoBubble(position, {
      content: bubbleContent,
    });

    uiInstance.addBubble(newBubble);
    setBubble(newBubble);

    // Confirm button handler
    setTimeout(() => {
      document.getElementById("confirmBtn")?.addEventListener("click", () => {
        alert(`Destination confirmed at (${position.lat.toFixed(5)}, ${position.lng.toFixed(5)})`);
      });
    }, 0);
  };

  const geocode = async () => {
    if (!query || !mapInstance) return;

    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
      query
    )}&apikey=${process.env.NEXT_PUBLIC_HERE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.items.length > 0) {
      const position = data.items[0].position;
      handleLocationSelection(position);
    } else {
      alert("Location not found!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      geocode();
    }
  };

  return (
    <div className="relative mt-20">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md">
        <input
          type="text"
          placeholder="Where do you want to go?"
          className="w-full bg-white rounded-full p-3 shadow-lg border focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div
        ref={mapRef}
        style={{ height: "80vh", width: "100%" }}
        className="rounded-md shadow-lg border border-[#E5E5E5]"
      ></div>
    </div>
  );
}

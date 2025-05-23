"use client";

import { useEffect, useRef, useState } from "react";
import { useTrip } from "../context/TripContext"; // ✅ use the hook instead
import TripParameters from "./TripParameters"; // Adjust path if needed

export default function MapComponent({ onConfirm }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [uiInstance, setUiInstance] = useState(null);
  const [marker, setMarker] = useState(null);
  const [bubble, setBubble] = useState(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [destinationConfirmed, setDestinationConfirmed] = useState(false);


  // ✅ Access trip data and updater from the custom hook
  const { tripParams, updateTripParams } = useTrip();

  // Initialize map
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

    setMapInstance(map);
    setUiInstance(ui);

    return () => map.dispose();
  }, []);

  // Fetch autosuggest suggestions as user types
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://autosuggest.search.hereapi.com/v1/autosuggest?apikey=${process.env.NEXT_PUBLIC_HERE_API_KEY}&q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        const data = await res.json();
        if (data.items) {
        setSuggestions(data.items.filter((item) => item.position));
        setError(null);
        } else {
        setSuggestions([]);
        setError(null);  // <-- Clear error instead of showing message
        }
      } catch (err) {
        setSuggestions([]);
        setError("Error fetching suggestions.");
      }
    };

    fetchSuggestions();
  }, [query]);

  // Helper: place marker, show bubble, pan and zoom map
  const placeMarkerAndBubble = (location) => {
    if (!mapInstance || !uiInstance) return;

    if (marker) {
      mapInstance.removeObject(marker);
    }
    if (bubble) {
      uiInstance.removeBubble(bubble);
    }

    const newMarker = new H.map.Marker(location.position);
    mapInstance.addObject(newMarker);
    setMarker(newMarker);

    mapInstance.getViewModel().setLookAtData(
      {
        position: location.position,
        zoom: 14,
      },
      true
    );

    // Create bubble content
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = `
      <div style="padding: 8px; max-width: 200px;">
        <p class="text-[#1A2E44] font-semibold mb-1">${
          location.title || "Selected Location"
        }</p>
        <p class="text-sm text-[#1A2E44] mb-2">${
          location.address.label || "No address available"
        }</p>
        <button id="confirmBtn" class="px-4 py-2 bg-[#20B2AA] hover:bg-[#1A2E44] text-white rounded-lg transition-colors duration-300 text-sm">
          Confirm Destination
        </button>
      </div>
    `;

    const infoBubble = new H.ui.InfoBubble(location.position, {
      content: contentDiv,
    });
    uiInstance.addBubble(infoBubble);
    setBubble(infoBubble);

    setTimeout(() => {
      const btn = document.getElementById("confirmBtn");
      if (btn) {
        btn.onclick = () => {
        console.log("Confirmed Destination:", location);
        alert(`Destination confirmed:\n${location.title || "Unnamed Location"}\n${location.address.label}`);

        updateTripParams("destination", location);

        // ✅ Show the TripParameters form now
        setDestinationConfirmed(true);

        if (onConfirm) onConfirm(location);
        };

      }
    }, 0);
  };

  // When user selects a suggestion or confirms input
  const onSelectLocation = async (location) => {
    placeMarkerAndBubble(location);
    setQuery(location.title || location.address.label || "");
    setSuggestions([]);
    setError(null);
  };

  // Geocode on Enter if no suggestion selected
  const geocodeInput = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
          query
        )}&apikey=${process.env.NEXT_PUBLIC_HERE_API_KEY}`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        onSelectLocation(data.items[0]);
      } else {
        setError("Location not found.");
        setSuggestions([]);
      }
    } catch (err) {
      setError("Error during geocoding.");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      geocodeInput();
    }
  };

  return (
    <div className="relative mt-20">
      {/* Trip Parameters UI */}
      {destinationConfirmed && <TripParameters />}

      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
        <input
          type="text"
          placeholder="Where do you want to go?"
          className="w-full bg-white rounded-full p-3 shadow-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Destination search input"
          autoComplete="off"
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="bg-white border border-[#20B2AA] rounded-b-lg shadow-lg max-h-60 overflow-y-auto mt-1 text-[#1A2E44]">
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="px-4 py-2 cursor-pointer hover:bg-[#20B2AA] hover:text-white transition-colors"
                onClick={() => onSelectLocation(item)}
              >
                {item.title || item.address?.label}
              </li>
            ))}
          </ul>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600 bg-red-100 rounded-md p-2">
            {error}
          </p>
        )}
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height: "80vh", width: "100%" }}
        className="rounded-md shadow-lg border border-[#E5E5E5]"
      ></div>
    </div>
  );
}

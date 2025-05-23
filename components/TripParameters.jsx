  // TripParameters.jsx
  "use client";

  import React from "react";
  import { useTrip } from "../context/TripContext";

  const tripTypes = ["Cultural", "Food", "Adventure", "Relaxation", "Nature"];

  export default function TripParameters() {
    const { tripParams, updateTripParams } = useTrip();

    // You can add a submit handler here
    const handleSubmit = (e) => {
      e.preventDefault();
      // For now, just log the tripParams or do something with it
      console.log("Trip submitted:", tripParams);
      // You can also add any further processing or navigation here
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-[#E5E5E5]"
      >
        <h2 className="text-xl font-semibold text-[#1A2E44] mb-6">Trip Details</h2>

        {/* Number of Days */}
        <label className="block mb-4">
          <span className="text-[#1A2E44] font-medium">Number of Days</span>
          <input
            type="number"
            min={1}
            max={30}
            value={tripParams.days}
            onChange={(e) => updateTripParams("days", parseInt(e.target.value, 10))}
            className="mt-1 block w-full rounded-md border border-[#20B2AA] p-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
        </label>

        {/* Budget Range */}
        <label className="block mb-4">
          <span className="text-[#1A2E44] font-medium mb-1 block">Budget Range ($)</span>
          <div className="flex space-x-2">
            <input
              type="number"
              min={0}
              max={tripParams.budget[1]}
              value={tripParams.budget[0]}
              onChange={(e) => {
                const val = Math.min(parseInt(e.target.value, 10) || 0, tripParams.budget[1]);
                updateTripParams("budget", [val, tripParams.budget[1]]);
              }}
              className="w-1/2 rounded-md border border-[#20B2AA] p-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
            <input
              type="number"
              min={tripParams.budget[0]}
              max={10000}
              value={tripParams.budget[1]}
              onChange={(e) => {
                const val = Math.max(parseInt(e.target.value, 10) || 0, tripParams.budget[0]);
                updateTripParams("budget", [tripParams.budget[0], val]);
              }}
              className="w-1/2 rounded-md border border-[#20B2AA] p-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
          </div>
        </label>

        {/* Number of People */}
        <label className="block mb-4">
          <span className="text-[#1A2E44] font-medium">Number of People</span>
          <input
            type="number"
            min={1}
            max={20}
            value={tripParams.people}
            onChange={(e) => updateTripParams("people", parseInt(e.target.value, 10))}
            className="mt-1 block w-full rounded-md border border-[#20B2AA] p-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
        </label>

        {/* Trip Type */}
        <label className="block mb-6">
          <span className="text-[#1A2E44] font-medium">Trip Type</span>
          <select
            value={tripParams.type}
            onChange={(e) => updateTripParams("type", e.target.value)}
            className="mt-1 block w-full rounded-md border border-[#20B2AA] p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          >
            {tripTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#20B2AA] hover:bg-[#1a8c8a] text-white font-semibold py-2 rounded-md transition"
        >
          Submit Trip Details
        </button>
      </form>
    );
  }

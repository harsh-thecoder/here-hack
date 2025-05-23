"use client";

import React, { useState } from "react";
import { useTrip } from "../context/TripContext";
import ReactMarkdown from "react-markdown";

const tripTypes = ["Cultural", "Food", "Adventure", "Relaxation", "Nature"];

export default function TripParameters() {
  const { tripParams, updateTripParams } = useTrip();
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeminiResponse(null);

    try {
      const requestBody = {
        destination: tripParams.destination,
        days: tripParams.days,
        budget: tripParams.budget,
        people: tripParams.people,
        type: tripParams.type,
      };

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(`Error from Gemini API: ${data.message || res.statusText}`);
      }

      setGeminiResponse(data);
      console.log("Gemini response:", data);
    } catch (err) {
      setError(err.message);
      console.error("Frontend error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) updateTripParams("days", val);
              else updateTripParams("days", 1);
            }}
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
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = 0;
                val = Math.min(val, tripParams.budget[1]);
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
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = tripParams.budget[0];
                val = Math.max(val, tripParams.budget[0]);
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
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) updateTripParams("people", val);
              else updateTripParams("people", 1);
            }}
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
          disabled={loading}
        >
          {loading ? "Generating..." : "Submit Trip Details"}
        </button>
      </form>

      {/* Show Gemini AI response or error */}
      {error && (
        <p className="max-w-md mx-auto mt-4 text-red-600">
          {error}
        </p>
      )}

      {geminiResponse && (
  <div className="max-w-md mx-auto mt-6 p-4 bg-[#F0F9F9] border border-[#20B2AA] rounded-md">
    <h3 className="text-lg font-semibold text-[#1A2E44] mb-2">Gemini AI Suggestions:</h3>
    <div className="prose text-[#1A2E44]">
      <ReactMarkdown>
        {geminiResponse.plan}
      </ReactMarkdown>
    </div>
  </div>
)}

    </>
  );
}

import React, { useState } from "react";
import { useTrip } from "../context/TripContext";

const mockFlights = [
  {
    id: 1,
    airline: "AirFast",
    from: "XYZ",
    to: "ABC",
    departure: "2025-06-15T08:00",
    arrival: "2025-06-15T12:00",
    price: 250,
    duration: "4h 0m",
  },
  {
    id: 2,
    airline: "SkyHigh",
    from: "XYZ",
    to: "ABC",
    departure: "2025-06-15T13:00",
    arrival: "2025-06-15T17:00",
    price: 280,
    duration: "4h 0m",
  },
];

export default function FlightOptions() {
  const { tripParams, updateTripParams } = useTrip();
  const [selectedFlightId, setSelectedFlightId] = useState(null);

  const handleSelectFlight = (flight) => {
    setSelectedFlightId(flight.id);
    updateTripParams("flight", flight);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-[#E5E5E5] mt-6">
      <h3 className="text-lg font-semibold mb-4">Select Your Flight</h3>
      <ul>
        {mockFlights.map((flight) => (
          <li
            key={flight.id}
            onClick={() => handleSelectFlight(flight)}
            className={`cursor-pointer p-3 mb-2 rounded-md border ${
              selectedFlightId === flight.id
                ? "border-[#20B2AA] bg-[#e0f7f7]"
                : "border-gray-300"
            }`}
          >
            <div>{flight.airline}</div>
            <div>
              {flight.from} → {flight.to}
            </div>
            <div>
              Departure: {new Date(flight.departure).toLocaleTimeString()}
            </div>
            <div>Price: ${flight.price}</div>
            <div>Duration: {flight.duration}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

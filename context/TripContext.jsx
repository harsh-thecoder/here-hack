// TripContext.jsx
"use client";

import React, { createContext, useContext, useState } from "react";

const TripContext = createContext();

export function TripProvider({ children }) {
  const [tripParams, setTripParams] = useState({
    days: 1,
    budget: [100, 1000], // min and max budget range
    people: 1,
    type: "Cultural",
  });

  const updateTripParams = (key, value) => {
    setTripParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <TripContext.Provider value={{ tripParams, updateTripParams }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}

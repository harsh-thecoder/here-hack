// components/ClientProviders.jsx
"use client";

import { TripProvider } from "../context/TripContext";

export default function ClientProviders({ children }) {
  return <TripProvider>{children}</TripProvider>;
}

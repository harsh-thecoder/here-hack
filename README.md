# 🌍 Here We Go: AI-Powered Trip Planner

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Pro-orange?style=for-the-badge&logo=google)
![HERE Maps](https://img.shields.io/badge/HERE-Maps_API-green?style=for-the-badge)

**Here We Go** is a full-stack, AI-driven travel planning application that transforms high-level user preferences (budget, trip type, duration, party size) into highly detailed, day-by-day travel itineraries. 

By unifying **Google's Gemini 1.5 Pro AI model** with the **HERE Maps Geocoding & Vector Rendering APIs**, this project solves the cognitive overload of vacation planning through a seamless, interactive UI.

## 📺 Demo Video
[Watch the Demo Video](https://www.youtube.com/watch?v=a4kHhW6lq3A&t=2s)

---

## ✨ Engineering Highlights & Architecture

This project was built with a strong emphasis on **component reusability**, **secure API architecture**, and **smooth UI/UX**.

### 1. 🔐 Secure Serverless AI Orchestration (Next.js API Routes)
To ensure **0 client-side key exposure**, the Google Gemini API integration is strictly handled server-side using Next.js App Router API endpoints (`app/api/gemini/route.js`). 
- **Dynamic Prompting:** The backend securely ingests user parameters (Destination, Budget Range, Pax, Trip Type) and dynamically constructs a strict context prompt for Gemini.
- **Error Boundaries:** The API layer includes robust error handling to gracefully catch and report `429 Too Many Requests` (Quota Limits) to the frontend.

### 2. 🗺️ Interactive Maps & Location Intelligence (HERE API)
The application leverages multiple REST endpoints from the **HERE Maps API** ecosystem:
- **Autosuggest API:** Provides real-time, low-latency location predictions as the user types in the destination field.
- **Vector Rendering:** Utilizes `H.Map` to dynamically render hardware-accelerated maps. 
- **Stateful Map Controllers:** The `MapComponent.jsx` reacts to state changes, automatically placing map markers and dynamically adjusting the camera `zoom` and `lookAtData` to focus on the selected destination.

### 3. 🧩 Modular UI & Global State Management
- **React Context API:** Uses `TripContext.jsx` to manage complex, deeply nested state (trip parameters, map coordinates, AI responses) across the component tree without prop-drilling.
- **Component-Driven Design:** The UI is split into focused components (e.g., `TripParameters.jsx`, `MapComponent.jsx`), making the codebase highly maintainable and readable.
- **Dynamic Content Parsing:** Utilizes `react-markdown` to safely parse and style the structured markdown itineraries returned by the Gemini AI, complete with Tailwind typography (`prose`).

---

## 🚀 Local Development Setup

Follow these instructions to run the project locally on your machine.

### Prerequisites
- Node.js 18+
- A Google Gemini API Key
- A HERE Maps API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harsh-thecoder/here-hack.git
   cd here-hack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   NEXT_PUBLIC_HERE_API_KEY=your_here_maps_api_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ✏️ Editing & Customization

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📖 Learn More (Next.js Resources)

To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

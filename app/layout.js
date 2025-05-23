// app/layout.js
import "./globals.css";
import ClientProviders from "../components/ClientProviders";

export const metadata = {
  title: "Here We Go",
  description: "Map-based destination picker using HERE Maps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* HERE Maps Scripts */}
        <script src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>
        <link rel="stylesheet" href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

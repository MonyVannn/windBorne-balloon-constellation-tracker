"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { BalloonData } from "@/types";
import StatsPanel from "@/components/StatsPanel";
import Controls from "@/components/Controls";
import Legend from "@/components/Legend";
import InfoPanel from "@/components/InfoPanel";

// Dynamically import map component (no SSR for Leaflet)
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [balloonData, setBalloonData] = useState<BalloonData | null>(null);
  const [historicalData, setHistoricalData] = useState<BalloonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [weatherPoints, setWeatherPoints] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const promises = [];
      // Fetch all 24 hours: 00.json through 23.json
      for (let i = 0; i < 24; i++) {
        promises.push(fetchBalloonData(i));
      }

      const results = await Promise.all(promises);
      const validData = results.filter((r): r is BalloonData => r !== null);

      console.log(`Loaded ${validData.length} hours of balloon data`);
      if (validData.length > 0) {
        console.log(
          `Most recent dataset has ${validData[0].balloons.length} balloons`
        );
      }

      setHistoricalData(validData);
      if (validData.length > 0) {
        setBalloonData(validData[0]);
      } else {
        console.error("No valid balloon data loaded!");
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalloonData = async (
    hoursAgo: number
  ): Promise<BalloonData | null> => {
    const paddedHours = hoursAgo.toString().padStart(2, "0");
    // Use our API route to avoid CORS issues
    const url = `/api/balloons?hours=${paddedHours}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch ${paddedHours}.json:`, response.status);
        return null;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.warn(`Invalid data format for ${paddedHours}.json`);
        return null;
      }

      const validBalloons = data.filter((balloon: any) => {
        if (!Array.isArray(balloon) || balloon.length < 3) return false;
        const [lat, lon, alt] = balloon;
        return (
          typeof lat === "number" &&
          typeof lon === "number" &&
          typeof alt === "number" &&
          lat >= -90 &&
          lat <= 90 &&
          lon >= -180 &&
          lon <= 180 &&
          alt >= 0 &&
          alt < 50
        );
      });

      return {
        hoursAgo,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
        balloons: validBalloons.map(([lat, lon, alt]: number[]) => ({
          latitude: lat,
          longitude: lon,
          altitude: alt,
        })),
      };
    } catch (error) {
      console.error(`Error fetching ${paddedHours}.json:`, error);
      return null;
    }
  };

  const handleRefresh = () => {
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            WindBorne Balloon Constellation Tracker
          </h1>
          <p className="text-center text-gray-300 text-lg">
            Real-time balloon positions with live weather integration
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">
              Loading balloon constellation data...
            </p>
          </div>
        ) : (
          <>
            <StatsPanel
              balloonData={balloonData}
              weatherPoints={weatherPoints}
            />

            <Controls onRefresh={handleRefresh} loading={loading} />

            <div className="mb-6">
              <MapComponent
                balloonData={balloonData}
                onWeatherPointsUpdate={setWeatherPoints}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Legend />
              <InfoPanel />
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-8 text-gray-400">
        <p>
          Built for WindBorne Systems | Data updates every hour | Using Next.js,
          Tailwind CSS & Open-Meteo API
        </p>
      </footer>
    </div>
  );
}

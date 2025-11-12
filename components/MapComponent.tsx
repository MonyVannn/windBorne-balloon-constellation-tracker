"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BalloonData, WeatherData } from "@/types";

interface MapComponentProps {
  balloonData: BalloonData | null;
  onWeatherPointsUpdate: (count: number) => void;
}

const getBalloonColor = (altitude: number): string => {
  if (altitude < 10) return "#3b82f6"; // Blue
  if (altitude < 15) return "#22c55e"; // Green
  if (altitude < 20) return "#f59e0b"; // Orange
  return "#ef4444"; // Red
};

const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
  };
  return codes[code] || "Unknown";
};

const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<WeatherData | null> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      pressure: data.current.pressure_msl,
      description: getWeatherDescription(data.current.weather_code),
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

export default function MapComponent({
  balloonData,
  onWeatherPointsUpdate,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [weatherCache] = useState<Map<string, WeatherData>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([20, 0], 2);
    mapRef.current = map;

    // Add dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !balloonData) {
      console.log("MapComponent: Map or balloon data not ready", {
        hasMap: !!mapRef.current,
        hasBalloonData: !!balloonData,
        balloonCount: balloonData?.balloons.length || 0,
      });
      return;
    }

    console.log(
      `MapComponent: Adding ${balloonData.balloons.length} balloons to map`
    );

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    let cancelled = false;

    const addMarkers = async () => {
      // Safety check: ensure map is still available
      if (!mapRef.current || cancelled) {
        console.warn("Map reference lost during marker addition");
        return;
      }

      let weatherFetched = 0;
      const sampleSize = Math.min(30, balloonData.balloons.length);
      const sampleIndices = new Set<number>();

      while (sampleIndices.size < sampleSize) {
        sampleIndices.add(
          Math.floor(Math.random() * balloonData.balloons.length)
        );
      }

      for (let i = 0; i < balloonData.balloons.length; i++) {
        // Check map is still valid before each marker
        if (!mapRef.current || cancelled) {
          console.warn("Map removed during marker loop");
          break;
        }

        const balloon = balloonData.balloons[i];
        const color = getBalloonColor(balloon.altitude);

        const icon = L.divIcon({
          className: "balloon-marker",
          html: `<div style="
            background: ${color};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        let weather: WeatherData | null = null;

        if (sampleIndices.has(i)) {
          const cacheKey = `${balloon.latitude.toFixed(
            1
          )},${balloon.longitude.toFixed(1)}`;

          if (weatherCache.has(cacheKey)) {
            weather = weatherCache.get(cacheKey)!;
            weatherFetched++;
          } else {
            weather = await fetchWeatherData(
              balloon.latitude,
              balloon.longitude
            );
            if (weather && !cancelled) {
              weatherCache.set(cacheKey, weather);
              weatherFetched++;
            }
          }
        }

        // Skip if cancelled during async operation
        if (cancelled) break;

        let popupContent = `
          <div style="min-width: 200px; color: #333;">
            <h3 style="margin: 0 0 10px 0; color: #111; font-weight: bold;">🎈 Balloon #${
              i + 1
            }</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${balloon.latitude.toFixed(
              4
            )}°, ${balloon.longitude.toFixed(4)}°</p>
            <p style="margin: 5px 0; color: #666;"><strong>Altitude:</strong> ${balloon.altitude.toFixed(
              2
            )} km</p>
        `;

        if (weather) {
          popupContent += `
            <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
            <h4 style="margin: 10px 0 5px 0; color: #111;">☁️ Weather Conditions</h4>
            <p style="margin: 5px 0; color: #666;"><strong>Condition:</strong> ${weather.description}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Temperature:</strong> ${weather.temperature}°C</p>
            <p style="margin: 5px 0; color: #666;"><strong>Humidity:</strong> ${weather.humidity}%</p>
            <p style="margin: 5px 0; color: #666;"><strong>Wind:</strong> ${weather.windSpeed} km/h at ${weather.windDirection}°</p>
            <p style="margin: 5px 0; color: #666;"><strong>Pressure:</strong> ${weather.pressure} hPa</p>
          `;
        }

        popupContent += `</div>`;

        const marker = L.marker([balloon.latitude, balloon.longitude], {
          icon,
        });
        marker.bindPopup(popupContent);

        // Final safety check before adding to map
        if (mapRef.current && !cancelled) {
          marker.addTo(mapRef.current);
          markersRef.current.push(marker);
        }
      }

      if (!cancelled) {
        onWeatherPointsUpdate(weatherFetched);
      }
    };

    addMarkers();

    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, [balloonData, onWeatherPointsUpdate, weatherCache]);

  return (
    <div
      ref={mapContainerRef}
      className="h-[600px] rounded-lg shadow-2xl border-2 border-white/20"
    />
  );
}

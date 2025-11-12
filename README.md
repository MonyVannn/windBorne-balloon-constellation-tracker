# WindBorne Balloon Constellation Tracker

An interactive real-time visualization of WindBorne Systems' weather balloon constellation, integrated with live weather data from Open-Meteo API.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-green?style=flat-square&logo=leaflet)

## Features

- **Real-time Balloon Tracking**: Visualizes 1,000+ weather balloons from WindBorne's global constellation
- **24-Hour Historical Data**: Fetches and displays balloon positions across all 24 hourly datasets
- **Live Weather Integration**: Integrates real-time weather data from Open-Meteo API for sample balloon locations
- **Interactive Map**: Click on any balloon marker to view detailed position and weather information
- **Color-coded Altitude**: Visual altitude representation with intuitive color gradients
- **Responsive Design**: Beautiful glassmorphism UI that works on all devices
- **Performance Optimized**: Client-side rendering with smart caching and async operations

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet.js with dark theme tiles from CARTO
- **Data Sources**:
  - [WindBorne Systems API](https://a.windbornesystems.com/treasure/) - Balloon position data
  - [Open-Meteo API](https://open-meteo.com/) - Weather data (temperature, humidity, wind, pressure)

## Data Integration

### WindBorne Balloon API
- **Endpoints**: 24 hourly datasets (`00.json` through `23.json`)
- **Format**: Array of `[latitude, longitude, altitude]` coordinates
- **Volume**: ~1,000 balloons per hour
- **Updates**: Hourly

### Open-Meteo Weather API
- **Purpose**: Provides real-time weather conditions at balloon locations
- **Data Points**: Temperature, humidity, precipitation, wind speed/direction, pressure
- **Sample Size**: 30 random balloons per dataset (for performance)
- **Caching**: Smart caching to minimize API calls

## Features Breakdown

### Altitude Color Coding
- 🔵 **Blue** (0-10 km): Lower atmosphere
- 🟢 **Green** (10-15 km): Mid-troposphere
- 🟠 **Orange** (15-20 km): Upper troposphere
- 🔴 **Red** (20+ km): Stratosphere

### Statistics Panel
- Total balloon count
- Average altitude
- Altitude range (min/max)
- Weather data points fetched
- Last update timestamp

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MonyVannn/windBorne-balloon-constellation-tracker.git
   cd windBorne-balloon-constellation-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
windborne-tracker/
├── app/
│   ├── api/
│   │   └── balloons/
│   │       └── route.ts          # API proxy to avoid CORS
│   ├── page.tsx                  # Main application page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── MapComponent.tsx          # Leaflet map with balloon markers
│   ├── StatsPanel.tsx            # Statistics display
│   ├── Controls.tsx              # Refresh button
│   ├── Legend.tsx                # Altitude color legend
│   └── InfoPanel.tsx             # Project information
├── types/
│   └── index.ts                  # TypeScript interfaces
├── public/                       # Static assets
└── README.md                     # This file
```

## API Routes

### `/api/balloons`
Server-side proxy to fetch balloon data from WindBorne API, bypassing CORS restrictions.

**Parameters**:
- `hours` (required): Hour offset (00-23)

**Example**:
```
GET /api/balloons?hours=00
```

**Response**: Array of balloon coordinates `[lat, lon, alt]`

## Key Implementation Details

### CORS Handling
The WindBorne API doesn't support CORS for browser requests. This is solved using a Next.js API route (`/app/api/balloons/route.ts`) that acts as a server-side proxy.

### Performance Optimization
- **Dynamic Import**: Map component is loaded client-side only (no SSR)
- **Weather Sampling**: Only fetches weather for 30 random balloons per dataset
- **Weather Caching**: Caches weather data by rounded coordinates
- **Race Condition Prevention**: Cleanup flags prevent stale async operations

### Data Validation
All balloon data is validated to ensure:
- Valid array format with 3 elements
- Latitude: -90 to 90
- Longitude: -180 to 180
- Altitude: 0 to 50 km (filters outliers)

---

**Note**: This application queries live data from WindBorne Systems' API. The balloon positions update hourly and represent real weather balloons flying around the globe! 🌍

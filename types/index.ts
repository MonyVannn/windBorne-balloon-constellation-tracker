export interface Balloon {
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface BalloonData {
  hoursAgo: number;
  timestamp: Date;
  balloons: Balloon[];
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  description: string;
}

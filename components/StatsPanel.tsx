import { BalloonData } from "@/types";

interface StatsPanelProps {
  balloonData: BalloonData | null;
  weatherPoints: number;
}

export default function StatsPanel({
  balloonData,
  weatherPoints,
}: StatsPanelProps) {
  const avgAltitude = balloonData
    ? (
        balloonData.balloons.reduce((sum, b) => sum + b.altitude, 0) /
        balloonData.balloons.length
      ).toFixed(2)
    : "0";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
        <div className="text-4xl font-bold text-green-400">
          {balloonData?.balloons.length || 0}
        </div>
        <div className="text-sm text-gray-300 mt-2">Active Balloons</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
        <div className="text-4xl font-bold text-blue-400">{avgAltitude}</div>
        <div className="text-sm text-gray-300 mt-2">Avg Altitude (km)</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
        <div className="text-4xl font-bold text-purple-400">
          {balloonData?.hoursAgo || 0}
        </div>
        <div className="text-sm text-gray-300 mt-2">Data Age (hours)</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
        <div className="text-4xl font-bold text-yellow-400">
          {weatherPoints}
        </div>
        <div className="text-sm text-gray-300 mt-2">Weather Points</div>
      </div>
    </div>
  );
}

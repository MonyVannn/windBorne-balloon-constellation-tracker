export default function Legend() {
  return (
    <div className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Legend</h3>

      <div className="space-y-3">
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white mr-3"></div>
          <span className="text-gray-200">Low Altitude (&lt; 10km)</span>
        </div>

        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white mr-3"></div>
          <span className="text-gray-200">Medium Altitude (10-15km)</span>
        </div>

        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white mr-3"></div>
          <span className="text-gray-200">High Altitude (15-20km)</span>
        </div>

        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white mr-3"></div>
          <span className="text-gray-200">Very High Altitude (&gt; 20km)</span>
        </div>
      </div>
    </div>
  );
}

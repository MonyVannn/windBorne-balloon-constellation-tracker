export default function InfoPanel() {
  return (
    <div className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">About This Project</h3>

      <div className="space-y-3 text-gray-200 text-sm leading-relaxed">
        <p>
          This interactive map combines WindBorne Systems&apos; live balloon
          constellation data with real-time weather information from Open-Meteo
          API.
        </p>

        <p>
          The balloons are color-coded by altitude, and clicking on each reveals
          detailed weather conditions at that location.
        </p>

        <p className="mt-4 pt-4 border-t border-white/20">
          <strong className="text-white">Why weather data?</strong> Since
          WindBorne creates weather balloons, combining their real-time
          positions with current weather conditions provides fascinating
          insights into how these balloons navigate different atmospheric
          conditions across the globe.
        </p>
      </div>
    </div>
  );
}

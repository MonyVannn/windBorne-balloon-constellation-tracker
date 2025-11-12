interface ControlsProps {
  onRefresh: () => void;
  loading: boolean;
}

export default function Controls({ onRefresh, loading }: ControlsProps) {
  return (
    <div className="flex gap-4 mb-6 flex-wrap justify-center">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/30 text-white rounded-lg transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? "Loading..." : "Refresh Data"}
      </button>
    </div>
  );
}

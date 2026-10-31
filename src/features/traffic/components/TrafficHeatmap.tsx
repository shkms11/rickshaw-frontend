import { useState } from "react";

type Cell = {
  id: number;
  intensity: number; // 0 to 1
};

const initialGrid: Cell[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  intensity: Math.random(),
}));

/** Displays a local randomized congestion-style sample grid; it is not backed by traffic data. */
export default function TrafficHeatmap() {
  const [grid] = useState(initialGrid);

  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {grid.map((cell) => (
          <div
            key={cell.id}
            className="h-16 rounded"
            style={{
              backgroundColor: `rgba(255,0,0,${cell.intensity})`,
            }}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-3">
        Red intensity = congestion level
      </p>
    </div>
  );
}

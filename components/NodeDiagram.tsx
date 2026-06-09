"use client";

const nodes = [
  { cx: 160, cy: 40 },
  { cx: 280, cy: 90 },
  { cx: 300, cy: 200 },
  { cx: 160, cy: 260 },
  { cx: 30, cy: 200 },
  { cx: 20, cy: 90 },
  { cx: 160, cy: 150 }, // center
];

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
  [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
];

export default function NodeDiagram() {
  return (
    <svg
      viewBox="0 0 320 300"
      className="w-full max-w-xs mx-auto"
      aria-hidden="true"
    >
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(59,110,248,0.4)" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="rgba(59,110,248,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          style={{ animation: `dash-flow ${1.5 + i * 0.2}s linear infinite` }}
        />
      ))}

      {/* Outer nodes */}
      {nodes.slice(0, 6).map((n, i) => (
        <g key={i}>
          <circle
            cx={n.cx}
            cy={n.cy}
            r="14"
            fill="rgba(59,110,248,0.08)"
            stroke="rgba(59,110,248,0.3)"
            strokeWidth="1.5"
            style={{ animation: `node-pulse ${2 + i * 0.3}s ease-in-out infinite` }}
          />
          <circle cx={n.cx} cy={n.cy} r="5" fill="#3B6EF8" />
        </g>
      ))}

      {/* Center node */}
      <circle
        cx={nodes[6].cx}
        cy={nodes[6].cy}
        r="20"
        fill="rgba(59,110,248,0.15)"
        stroke="rgba(59,110,248,0.5)"
        strokeWidth="2"
        style={{ animation: "node-pulse 1.8s ease-in-out infinite" }}
      />
      <circle cx={nodes[6].cx} cy={nodes[6].cy} r="7" fill="#3B6EF8" />
      <text
        x={nodes[6].cx}
        y={nodes[6].cy + 32}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize="9"
        fontFamily="Inter, sans-serif"
      >
        Baalot Chain
      </text>
    </svg>
  );
}

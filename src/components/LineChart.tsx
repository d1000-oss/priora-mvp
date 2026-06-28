interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      values: number[];
      color: string;
    }[];
  };
  height?: number;
}

export function LineChart({ data, height = 200 }: LineChartProps) {
  const { labels, datasets } = data;
  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const width = 700;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allValues = datasets.flatMap((d) => d.values);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(0, ...allValues);
  const range = maxValue - minValue || 1;

  const getX = (index: number) => padding.left + (index / (labels.length - 1)) * chartWidth;
  const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / range) * chartHeight;

  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) =>
    Math.round(minValue + (range / gridLines) * i)
  );

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {gridValues.map((val) => (
          <g key={val}>
            <line
              x1={padding.left}
              y1={getY(val)}
              x2={width - padding.right}
              y2={getY(val)}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={getY(val) + 4}
              textAnchor="end"
              className="text-[10px] fill-gray-400"
              fontSize="10"
            >
              {val}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {labels.map((label, i) => (
          <text
            key={label}
            x={getX(i)}
            y={height - 10}
            textAnchor="middle"
            className="text-[10px] fill-gray-500"
            fontSize="10"
          >
            {label}
          </text>
        ))}

        {/* Lines and dots */}
        {datasets.map((dataset) => {
          const points = dataset.values.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
          return (
            <g key={dataset.label}>
              <polyline
                points={points}
                fill="none"
                stroke={dataset.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {dataset.values.map((v, i) => (
                <circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(v)}
                  r="4"
                  fill={dataset.color}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center flex-wrap">
        {datasets.map((dataset) => (
          <div key={dataset.label} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: dataset.color }} />
            <span className="text-[11px] text-text-tertiary">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

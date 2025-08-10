import React from 'react';

interface MiniChartProps {
  data: number[];
  color: string;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({ data, color, height = 60 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range === 0 ? 50 : ((max - value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((_, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = range === 0 ? 50 : ((max - data[index]) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default MiniChart;
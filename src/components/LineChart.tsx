import React, { useEffect, useRef, useState } from 'react';

interface DataPoint {
  timestamp: Date;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
  unit: string;
  color: string;
  height?: number;
  showGrid?: boolean;
  animate?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  unit,
  color,
  height = 200,
  showGrid = true,
  animate = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0 || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = dimensions.width - padding * 2;
    const chartHeight = dimensions.height - padding * 2;

    // Find min/max values with some padding
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    const paddedMin = minValue - valueRange * 0.1;
    const paddedMax = maxValue + valueRange * 0.1;
    const paddedRange = paddedMax - paddedMin;

    // Time range
    const timeRange = data[data.length - 1].timestamp.getTime() - data[0].timestamp.getTime();

    // Helper functions
    const getX = (timestamp: Date) => {
      const timeOffset = timestamp.getTime() - data[0].timestamp.getTime();
      return padding + (timeOffset / timeRange) * chartWidth;
    };

    const getY = (value: number) => {
      return padding + chartHeight - ((value - paddedMin) / paddedRange) * chartHeight;
    };

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.3)';
      ctx.lineWidth = 1;

      // Horizontal grid lines
      for (let i = 0; i <= 4; i++) {
        const y = padding + (i / 4) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }

      // Vertical grid lines
      for (let i = 0; i <= 6; i++) {
        const x = padding + (i / 6) * chartWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
      }
    }

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
    gradient.addColorStop(0, `${color}20`);
    gradient.addColorStop(1, `${color}05`);

    ctx.beginPath();
    ctx.moveTo(getX(data[0].timestamp), getY(data[0].value));

    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(getX(data[i].timestamp), getY(data[i].value));
    }

    // Complete the fill area
    ctx.lineTo(getX(data[data.length - 1].timestamp), padding + chartHeight);
    ctx.lineTo(getX(data[0].timestamp), padding + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(getX(data[0].timestamp), getY(data[0].value));

    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(getX(data[i].timestamp), getY(data[i].value));
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw data points
    data.forEach((point, index) => {
      const x = getX(point.timestamp);
      const y = getY(point.value);

      // Highlight the last point
      if (index === data.length - 1) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });

    // Draw value labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const value = paddedMax - (i / 4) * paddedRange;
      const y = padding + (i / 4) * chartHeight;
      ctx.fillText(value.toFixed(1), padding - 8, y + 4);
    }

    // Draw current value
    if (data.length > 0) {
      const currentValue = data[data.length - 1].value;
      const currentY = getY(currentValue);
      
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${currentValue.toFixed(1)} ${unit}`, padding + chartWidth + 8, currentY + 4);
    }

  }, [data, dimensions, color, unit, showGrid]);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default LineChart;
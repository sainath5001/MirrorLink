'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface PriceChartProps {
  originData: Array<{
    timestamp: bigint | number;
    price: bigint | number;
    roundId: bigint | number;
  }>;
  destData: Array<{
    timestamp: bigint | number;
    price: bigint | number;
    roundId: bigint | number;
  }>;
  className?: string;
}

export default function PriceChart({
  originData,
  destData,
  className = '',
}: PriceChartProps) {
  const [showOrigin, setShowOrigin] = useState(true);
  const [showDest, setShowDest] = useState(true);

  const chartData = useMemo(() => {
    const allTimestamps = new Set<number>();
    
    originData.forEach((d) => {
      const ts = typeof d.timestamp === 'bigint' ? Number(d.timestamp) : d.timestamp;
      allTimestamps.add(ts);
    });
    
    destData.forEach((d) => {
      const ts = typeof d.timestamp === 'bigint' ? Number(d.timestamp) : d.timestamp;
      allTimestamps.add(ts);
    });

    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);
    const maxPoints = 200;
    const timestamps = sortedTimestamps.slice(-maxPoints);

    return timestamps.map((timestamp) => {
      const originPoint = originData.find(
        (d) => (typeof d.timestamp === 'bigint' ? Number(d.timestamp) : d.timestamp) === timestamp
      );
      const destPoint = destData.find(
        (d) => (typeof d.timestamp === 'bigint' ? Number(d.timestamp) : d.timestamp) === timestamp
      );

      return {
        timestamp,
        time: format(new Date(timestamp * 1000), 'HH:mm:ss'),
        originPrice: originPoint
          ? typeof originPoint.price === 'bigint'
            ? Number(originPoint.price) / 1e8
            : originPoint.price / 1e8
          : null,
        destPrice: destPoint
          ? typeof destPoint.price === 'bigint'
            ? Number(destPoint.price) / 1e8
            : destPoint.price / 1e8
          : null,
        originRoundId: originPoint?.roundId?.toString() || '',
        destRoundId: destPoint?.roundId?.toString() || '',
      };
    });
  }, [originData, destData]);

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        time: string;
        originPrice: number | null;
        destPrice: number | null;
        originRoundId: string;
        destRoundId: string;
      };
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-2">{data.time}</p>
          {data.originPrice !== null && (
            <p className="text-xs text-blue-600">
              Origin: ${data.originPrice.toFixed(2)} (Round: {data.originRoundId})
            </p>
          )}
          {data.destPrice !== null && (
            <p className="text-xs text-green-600">
              Destination: ${data.destPrice.toFixed(2)} (Round: {data.destRoundId})
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Price History
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOrigin}
              onChange={(e) => setShowOrigin(e.target.checked)}
              className="rounded"
            />
            <span className="text-blue-600">Origin</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDest}
              onChange={(e) => setShowDest(e.target.checked)}
              className="rounded"
            />
            <span className="text-green-600">Destination</span>
          </label>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {showOrigin && (
              <Line
                type="monotone"
                dataKey="originPrice"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Origin (Arbitrum)"
                connectNulls
              />
            )}
            {showDest && (
              <Line
                type="monotone"
                dataKey="destPrice"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Destination (Base)"
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}


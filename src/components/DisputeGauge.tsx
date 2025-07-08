import React from 'react';
import { Eye } from 'lucide-react';

interface DisputeGaugeProps {
  disputeCount: number;
  viewCount: number;
  onViewDisputes: () => void;
}

const DisputeGauge: React.FC<DisputeGaugeProps> = ({ disputeCount, viewCount, onViewDisputes }) => {
  const percentage = Math.round((disputeCount / viewCount) * 100) || 0;

  return (
    <div className="relative group cursor-pointer" onClick={onViewDisputes}>
      <div className="w-10 h-10 relative">
        <div className="absolute inset-0 bg-gray-200 rounded-full" />
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-1/2 w-1/2 h-full bg-red-500 origin-left transform transition-transform duration-500"
            style={{ 
              transform: `rotate(${percentage * 3.6}deg)`,
              transformOrigin: 'left center'
            }}
          />
        </div>
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
          <Eye className="w-3 h-3 text-gray-600" />
        </div>
      </div>
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {percentage}% of viewers disputed this post
      </div>
    </div>
  );
};

export default DisputeGauge;
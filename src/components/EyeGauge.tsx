import React from 'react';

interface EyeGaugeProps {
  viewCount: number;
  disputeCount: number;
}

const EyeGauge: React.FC<EyeGaugeProps> = ({ viewCount, disputeCount }) => {
  const disputePercentage = Math.round((disputeCount / viewCount) * 100) || 0;
  const activeSegments = disputeCount > 0 ? Math.ceil((disputeCount / viewCount) * 10) : 0;

  return (
    <div className="bg-yellow-50 p-2 rounded-md">
      <div className="flex items-center space-x-2">
        <div className="relative w-[60px] h-[30px] cursor-pointer group">
          {/* Eye shape background */}
          <div 
            className="absolute inset-0 bg-gray-200 overflow-hidden"
            style={{ 
              borderRadius: '30px / 15px',
              clipPath: 'ellipse(100% 80% at 50% 50%)'
            }}
          >
            {/* Segments container */}
            <div 
              className="absolute inset-0 overflow-hidden z-10"
              style={{ borderRadius: '30px / 15px' }}
            >
              <div className="flex h-full">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full border-r border-white/30 ${
                      i < activeSegments ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Iris layer */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] bg-gray-300 rounded-full z-0" />
          
          {/* Pupil with view count */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-white rounded-full flex items-center justify-center shadow-sm z-20">
            <span className="text-xs text-gray-500">{viewCount}</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
            {disputePercentage}% Report rate ({disputeCount} of {viewCount} viewers reported this as misinformation)
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-gray-600">views</span>
          <div className="flex items-center space-x-1 text-sm border-l border-gray-300 pl-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
            <span className="text-xs text-gray-500">{disputePercentage}% reported</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeGauge;
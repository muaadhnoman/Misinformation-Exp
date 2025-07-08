import React from 'react';
import { X, ChevronRight } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScamFraud: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSelectScamFraud
}) => {
  if (!isOpen) return null;

  const reportOptions = [
    {
      title: 'Problem involving someone under 18',
      onClick: () => onClose()
    },
    {
      title: 'Bullying, harassment or abuse',
      onClick: () => onClose()
    },
    {
      title: 'Suicide or self-harm',
      onClick: () => onClose()
    },
    {
      title: 'Violent, hateful or disturbing content',
      onClick: () => onClose()
    },
    {
      title: 'Selling or promoting restricted items',
      onClick: () => onClose()
    },
    {
      title: 'Adult content',
      onClick: () => onClose()
    },
    {
      title: 'Scam, fraud or false information',
      onClick: onSelectScamFraud
    },
    {
      title: 'Intellectual property',
      onClick: () => onClose()
    },
    {
      title: 'I don\'t want to see this',
      onClick: () => onClose()
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Report</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Why are you reporting this post?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            If someone is in immediate danger, get help before reporting to Facebook. Don't wait.
          </p>

          <div className="space-y-0">
            {reportOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-900 font-medium">{option.title}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
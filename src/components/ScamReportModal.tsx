import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSelectFalseInformation: () => void;
}

const ScamReportModal: React.FC<ScamReportModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onSelectFalseInformation
}) => {
  if (!isOpen) return null;

  const scamOptions = [
    {
      title: 'Fraud or scam',
      onClick: () => onClose()
    },
    {
      title: 'Sharing false information',
      onClick: onSelectFalseInformation
    },
    {
      title: 'Spam',
      onClick: () => onClose()
    },
    {
      title: 'Pretending to be a business',
      onClick: () => onClose()
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-2">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 flex-grow text-center">Report</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Which best describes the problem?
          </h3>

          <div className="space-y-0">
            {scamOptions.map((option, index) => (
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

export default ScamReportModal;
import React from 'react';
import { Check, Shield, UserX, UserMinus } from 'lucide-react';

interface ReportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
}

const ReportSuccessModal: React.FC<ReportSuccessModalProps> = ({
  isOpen,
  onClose,
  profileName
}) => {
  if (!isOpen) return null;

  const additionalActions = [
    {
      icon: Shield,
      title: `Block ${profileName}'s profile`,
      description: 'You won\'t be able to see or contact each other.',
      onClick: () => onClose()
    },
    {
      icon: UserX,
      title: `Unfollow ${profileName}`,
      description: 'Stop seeing posts but stay friends.',
      onClick: () => onClose()
    },
    {
      icon: UserMinus,
      title: `Unfriend ${profileName}`,
      description: 'You\'ll no longer be friends on Facebook.',
      onClick: () => onClose()
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Thanks for letting us know.
          </h2>
          <p className="text-gray-600 mb-8">
            We use your feedback to help our systems learn when something isn't right.
          </p>

          {/* Additional Actions */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Other steps you can take
            </h3>
            <div className="space-y-3">
              {additionalActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors text-left rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900 text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportSuccessModal;
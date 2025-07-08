import React, { useState } from 'react';
import { X, Globe, User, Shield } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispute: () => void;
}

const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, onDispute }) => {
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'private' | 'platform'>('platform');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onDispute();
    onClose();
    setReason('');
  };

  if (!isOpen) return null;

  const visibilityOptions = [
    {
      key: 'public' as const,
      icon: Globe,
      title: 'Public',
      description: 'All users can see your identity',
      color: 'green'
    },
    {
      key: 'private' as const,
      icon: User,
      title: 'Private',
      description: 'Only the poster will see your identity',
      color: 'blue'
    },
    {
      key: 'platform' as const,
      icon: Shield,
      title: 'Platform',
      description: 'Only platform moderators will see your identity',
      color: 'purple'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Dispute this post</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Select who can see your identity (account name, profile picture):
          </p>

          <div className="space-y-3">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedVisibility === option.key;
              const colorClasses = {
                green: 'bg-green-100 text-green-600',
                blue: 'bg-blue-100 text-blue-600',
                purple: 'bg-purple-100 text-purple-600'
              };

              return (
                <div
                  key={option.key}
                  onClick={() => setSelectedVisibility(option.key)}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${colorClasses[option.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-sm">{option.title}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for dispute (optional):
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Explain why you're disputing this post..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Submit Dispute
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisputeModal;
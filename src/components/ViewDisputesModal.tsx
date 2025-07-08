import React, { useState } from 'react';
import { X, Globe, User, Shield } from 'lucide-react';

interface Dispute {
  id: number;
  name: string;
  initial: string;
  visibility: 'public' | 'private' | 'platform';
  reason: string;
  time: string;
}

interface ViewDisputesModalProps {
  isOpen: boolean;
  onClose: () => void;
  disputeCount: number;
  setDisputeCount: (count: number) => void;
}

const ViewDisputesModal: React.FC<ViewDisputesModalProps> = ({
  isOpen,
  onClose,
  disputeCount,
  setDisputeCount
}) => {
  const [filter, setFilter] = useState<'all' | 'public' | 'private' | 'platform'>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'private' | 'platform'>('public');
  const [newReason, setNewReason] = useState('');

  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 1,
      name: 'Alex Johnson',
      initial: 'A',
      visibility: 'public',
      reason: 'This information is misleading',
      time: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      initial: 'S',
      visibility: 'public',
      reason: 'Contains factual errors',
      time: '1 hour ago'
    },
    {
      id: 3,
      name: 'Michael Brown',
      initial: 'M',
      visibility: 'private',
      reason: 'I disagree with this content',
      time: '45 minutes ago'
    },
    {
      id: 4,
      name: 'Emma Davis',
      initial: 'E',
      visibility: 'platform',
      reason: 'Potentially harmful content',
      time: '30 minutes ago'
    },
    {
      id: 5,
      name: 'James Wilson',
      initial: 'J',
      visibility: 'public',
      reason: 'This is not accurate',
      time: '20 minutes ago'
    }
  ]);

  const handleSubmitDispute = () => {
    if (newReason.trim()) {
      const newDispute: Dispute = {
        id: Date.now(),
        name: 'Muaadh (You)',
        initial: 'M',
        visibility: selectedVisibility,
        reason: newReason,
        time: 'Just now'
      };
      setDisputes(prev => [newDispute, ...prev]);
      setDisputeCount(disputeCount + 1);
      setNewReason('');
    }
  };

  const filteredDisputes = filter === 'all' ? disputes : disputes.filter(d => d.visibility === filter);

  const renderDispute = (dispute: Dispute) => {
    const isCurrentUser = dispute.name === 'Muaadh (You)';
    const shouldBlur = dispute.visibility !== 'public' && !isCurrentUser;

    const visibilityConfig = {
      public: { icon: Globe, color: 'green', label: 'Public' },
      private: { icon: User, color: 'blue', label: 'Private' },
      platform: { icon: Shield, color: 'purple', label: 'Platform' }
    };

    const config = visibilityConfig[dispute.visibility];
    const Icon = config.icon;

    return (
      <div key={dispute.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
            shouldBlur ? 'bg-gray-500 blur-sm' : 'bg-blue-500'
          }`}>
            {shouldBlur ? '?' : dispute.initial}
          </div>
          <div className="flex-grow">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`font-medium text-sm ${shouldBlur ? 'blur-sm' : ''}`}>
                {dispute.name}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                config.color === 'green' ? 'bg-green-100 text-green-600' :
                config.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <Icon className="w-3 h-3 inline mr-1" />
                {config.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{dispute.reason}</p>
            <div className="text-xs text-gray-500">{dispute.time}</div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">View Disputes</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Dispute Form */}
        <div className="p-4 bg-red-50 border-b border-red-200">
          <h4 className="text-sm font-medium text-red-700 mb-2">Submit your dispute:</h4>
          <textarea
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
            placeholder="Explain why you're disputing this post..."
          />
          <div className="text-xs text-gray-600 mb-2">
            Choose visibility of your identity:
          </div>
          <div className="flex items-center justify-between">
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value as 'public' | 'private' | 'platform')}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
            >
              <option value="public">🌐 Public</option>
              <option value="private">👤 Private</option>
              <option value="platform">🛡️ Platform</option>
            </select>
            <button
              onClick={handleSubmitDispute}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              Submit Dispute
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {filteredDisputes.length} dispute{filteredDisputes.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-2">
              {(['all', 'public', 'private', 'platform'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {filteredDisputes.length > 0 ? (
              filteredDisputes.map(renderDispute)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No disputes with this visibility setting
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-4 flex items-start">
              <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Names and profile pictures are blurred for private and platform-level disputes to protect user privacy.
            </div>
            <div className="text-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDisputesModal;
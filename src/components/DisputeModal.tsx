import React, { useState } from 'react';
import { X, Globe, User, Shield, ChevronDown } from 'lucide-react';

interface Dispute {
  id: number;
  name: string;
  initial: string;
  visibility: 'public' | 'private' | 'platform';
  reason: string;
  time: string;
}

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispute: () => void;
  disputeCount: number;
  setDisputeCount: (count: number) => void;
}

const DisputeModal: React.FC<DisputeModalProps> = ({ 
  isOpen, 
  onClose, 
  onDispute, 
  disputeCount, 
  setDisputeCount 
}) => {
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'private' | 'platform'>('public');
  const [reason, setReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'private' | 'platform'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 1,
      name: 'Noah Rodriguez',
      initial: 'N',
      visibility: 'public',
      reason: 'This post contains misinformation',
      time: '1 day ago'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      initial: 'S',
      visibility: 'private',
      reason: 'I believe this is false',
      time: '2 days ago'
    },
    {
      id: 3,
      name: 'Michael Brown',
      initial: 'M',
      visibility: 'platform',
      reason: 'This needs to be reviewed',
      time: '3 days ago'
    },
    {
      id: 4,
      name: 'Charlotte Perez',
      initial: 'C',
      visibility: 'public',
      reason: 'I disagree with this content',
      time: '3 days ago'
    }
  ]);

  const handleSubmit = () => {
    if (reason.trim()) {
      const newDispute: Dispute = {
        id: Date.now(),
        name: 'Muaadh (You)',
        initial: 'M',
        visibility: selectedVisibility,
        reason: reason,
        time: 'Just now'
      };
      setDisputes(prev => [newDispute, ...prev]);
      setDisputeCount(disputeCount + 1);
      setReason('');
      onDispute();
    }
  };

  const filteredDisputes = filter === 'all' ? disputes : disputes.filter(d => d.visibility === filter);

  const visibilityOptions = [
    { key: 'public' as const, icon: Globe, label: 'Public' },
    { key: 'private' as const, icon: User, label: 'Private' },
    { key: 'platform' as const, icon: Shield, label: 'Platform' }
  ];

  const selectedOption = visibilityOptions.find(opt => opt.key === selectedVisibility);

  const renderDispute = (dispute: Dispute) => {
    const isCurrentUser = dispute.name === 'Muaadh (You)';
    const shouldBlur = dispute.visibility !== 'public' && !isCurrentUser;

    const visibilityConfig = {
      public: { icon: Globe, color: 'text-green-600', label: 'Public' },
      private: { icon: User, color: 'text-blue-600', label: 'Private' },
      platform: { icon: Shield, color: 'text-purple-600', label: 'Platform' }
    };

    const config = visibilityConfig[dispute.visibility];
    const Icon = config.icon;

    return (
      <div key={dispute.id} className="p-3 border-b border-gray-100 last:border-b-0">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
            shouldBlur ? 'bg-gray-400 blur-sm' : 'bg-blue-500'
          }`}>
            {shouldBlur ? '?' : dispute.initial}
          </div>
          <div className="flex-grow">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`font-medium text-sm ${shouldBlur ? 'text-gray-500 blur-sm' : 'text-gray-900'}`}>
                {dispute.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">{dispute.reason}</p>
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispute Submission Form */}
        <div className="p-4 bg-red-50 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-700 mb-4">Submit your dispute:</h3>
          
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 resize-none"
            placeholder="Explain why you're disputing this post..."
          />

          <div className="flex items-center justify-between">
            <div className="flex-grow mr-4">
              <div className="text-sm text-gray-700 mb-2">
                Choose visibility of your identity (your name & profile picture):
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <div className="flex items-center">
                    {selectedOption && (
                      <>
                        <selectedOption.icon className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm text-gray-900">{selectedOption.label}</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {visibilityOptions.map((option) => {
                      const Icon = option.icon;
                      const descriptions = {
                        public: 'All users can see your identity',
                        private: 'Only the poster can see your identity',
                        platform: 'Only the platform moderators can see your identity'
                      };
                      return (
                        <button
                          key={option.key}
                          onClick={() => {
                            setSelectedVisibility(option.key);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50"
                        >
                          <Icon className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-500">{descriptions[option.key]}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm mt-2"
            >
              Submit Dispute
            </button>
          </div>
        </div>

        {/* Disputes List */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-700 font-medium">
              {disputes.length} users have disputed this post
            </div>
            <div className="flex space-x-1">
              {(['all', 'public', 'private', 'platform'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredDisputes.length > 0 ? (
              filteredDisputes.map(renderDispute)
            ) : (
              <div className="p-4 text-center text-gray-500">
                No disputes with this visibility setting
              </div>
            )}
          </div>

          <div className="mt-4 flex items-start text-xs text-gray-500">
            <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs">i</span>
            </div>
            <span>
              Names and profile pictures are blurred for private and platform-level disputes to protect user privacy.
            </span>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeModal;
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
      name: 'Anonymous User',
      initial: 'A',
      visibility: 'private',
      reason: 'I believe this is false',
      time: '2 days ago'
    },
    {
      id: 3,
      name: 'Moderator Review',
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
      time: '4 days ago'
    }
  ]);

  const handleSubmitDispute = () => {
    if (newReason.trim()) {
      const newDispute: Dispute = {
        id: Date.now(),
        name: 'You',
        initial: 'Y',
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

  const visibilityOptions = [
    { key: 'public' as const, icon: Globe, label: 'Public' },
    { key: 'private' as const, icon: User, label: 'Private' },
    { key: 'platform' as const, icon: Shield, label: 'Platform' }
  ];

  const selectedOption = visibilityOptions.find(opt => opt.key === selectedVisibility);

  const renderDispute = (dispute: Dispute) => {
    const isCurrentUser = dispute.name === 'You';
    const shouldBlur = dispute.visibility !== 'public' && !isCurrentUser;
    
    const getVisibilityDisplay = () => {
      switch (dispute.visibility) {
        case 'public':
          return <span className="inline-flex items-center text-green-600 text-sm"><Globe className="w-4 h-4 mr-1" />Public</span>;
        case 'private':
          return <span className="inline-flex items-center text-blue-600 text-sm"><User className="w-4 h-4 mr-1" />Private</span>;
        case 'platform':
          return <span className="inline-flex items-center text-purple-600 text-sm"><Shield className="w-4 h-4 mr-1" />Platform</span>;
      }
    };

    const getDisplayName = () => {
      if (dispute.visibility === 'private' && !isCurrentUser) {
        return '(Anonymous to others)';
      }
      if (dispute.visibility === 'platform' && !isCurrentUser) {
        return '(Visible to moderators)';
      }
      return dispute.name;
    };

    return (
      <div key={dispute.id} className="flex items-start space-x-3 py-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
          shouldBlur ? 'bg-gray-400 blur-sm' : 'bg-blue-500'
        }`}>
          {shouldBlur ? '?' : dispute.initial}
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`font-medium text-gray-900 ${shouldBlur ? 'blur-sm' : ''}`}>
              {getDisplayName()}
            </span>
            {getVisibilityDisplay()}
          </div>
          <p className="text-gray-700 mb-1">{dispute.reason}</p>
          <div className="text-sm text-gray-500">{dispute.time}</div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div></div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submit Dispute Form */}
        <div className="p-4 bg-red-50">
          <h3 className="text-red-600 font-medium mb-3">Submit your dispute:</h3>
          <textarea
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3 resize-none"
            placeholder="Explain why you're disputing this post..."
          />
          
          <div className="text-sm text-gray-700 mb-2">
            Choose visibility of your identity (your name & profile picture):
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <div className="flex items-center">
                  {selectedOption && <selectedOption.icon className="w-4 h-4 mr-2 text-blue-500" />}
                  <span>{selectedOption?.label}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                  {visibilityOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSelectedVisibility(option.key);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-50 text-left"
                      >
                        <Icon className="w-4 h-4 mr-2 text-blue-500" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSubmitDispute}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Submit Dispute
            </button>
          </div>
        </div>

        {/* Disputes List */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">
              {disputeCount} users have disputed this post
            </span>
            <div className="flex space-x-1">
              {(['all', 'public', 'private', 'platform'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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

          <div className="space-y-0 max-h-80 overflow-y-auto border-t border-gray-200">
            {filteredDisputes.length > 0 ? (
              filteredDisputes.map(renderDispute)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No disputes with this visibility setting
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start text-xs text-gray-500">
              <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <span className="text-white font-bold text-xs">i</span>
              </div>
              <span>Names and profile pictures are blurred for private and platform-level disputes to protect user privacy.</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDisputesModal;
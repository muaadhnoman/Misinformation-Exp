import React, { useRef, useEffect } from 'react';
import { Plus, Minus, Bookmark, Bell, X, Clock, UserX, AlertTriangle, Shield, Copy } from 'lucide-react';

interface PostOptionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onReportPost: () => void;
  profileName: string;
}

const PostOptionsDropdown: React.FC<PostOptionsDropdownProps> = ({
  isOpen,
  onClose,
  onReportPost,
  profileName
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const options = [
    {
      icon: Plus,
      title: 'Interested',
      description: 'More of your posts will be like this.',
      onClick: () => onClose()
    },
    {
      icon: Minus,
      title: 'Not interested',
      description: 'Fewer of your posts will be like this.',
      onClick: () => onClose()
    },
    {
      icon: Bookmark,
      title: 'Save Post',
      description: 'Add this to your saved items.',
      onClick: () => onClose()
    },
    {
      icon: Bell,
      title: 'Turn on notifications for this post',
      description: '',
      onClick: () => onClose()
    },
    {
      icon: X,
      title: 'Hide post',
      description: 'See fewer posts like this.',
      onClick: () => onClose()
    },
    {
      icon: Clock,
      title: `Snooze ${profileName} for 30 days`,
      description: 'Temporarily stop seeing posts.',
      onClick: () => onClose()
    },
    {
      icon: UserX,
      title: `Unfollow ${profileName}`,
      description: 'Stop seeing posts but stay friends.',
      onClick: () => onClose()
    },
    {
      icon: AlertTriangle,
      title: 'Report post',
      description: `We won't let ${profileName} know who reported this.`,
      onClick: () => {
        onReportPost();
        onClose();
      }
    },
    {
      icon: Shield,
      title: `Block ${profileName}'s profile`,
      description: 'You won\'t be able to see or contact each other.',
      onClick: () => onClose()
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={dropdownRef} className="bg-white rounded-lg max-w-sm w-full shadow-xl">
        <div className="p-1">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={option.onClick}
                className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-gray-900 text-sm">{option.title}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostOptionsDropdown;
import React, { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { PostSettings } from '../services/settingsService';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postText: string;
  postImage: string | null;
  viewCount: number;
  disputeCount: number;
  profileInitial: string;
  profileName: string;
  profileTime: string;
  settings: PostSettings;
  onSave: (
    postText: string,
    postImage: string | null,
    viewCount: number,
    disputeCount: number,
    profileInitial: string,
    profileName: string,
    profileTime: string,
    settings: PostSettings
  ) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  postText,
  postImage,
  viewCount,
  disputeCount,
  profileInitial,
  profileName,
  profileTime,
  settings,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [tempText, setTempText] = useState(postText);
  const [tempImage, setTempImage] = useState(postImage);
  const [tempViewCount, setTempViewCount] = useState(viewCount);
  const [tempDisputeCount, setTempDisputeCount] = useState(disputeCount);
  const [tempProfileInitial, setTempProfileInitial] = useState(profileInitial);
  const [tempProfileName, setTempProfileName] = useState(profileName);
  const [tempProfileTime, setTempProfileTime] = useState(profileTime);
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempText(postText);
    setTempImage(postImage);
    setTempViewCount(viewCount);
    setTempDisputeCount(disputeCount);
    setTempProfileInitial(profileInitial);
    setTempProfileName(profileName);
    setTempProfileTime(profileTime);
    setTempSettings(settings);
  }, [postText, postImage, viewCount, disputeCount, profileInitial, profileName, profileTime, settings]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(
      tempText,
      tempImage,
      tempViewCount,
      tempDisputeCount,
      tempProfileInitial,
      tempProfileName,
      tempProfileTime,
      tempSettings
    );
    // Don't call onClose() here - let the parent handle it after successful save
  };

  const handleCancel = () => {
    setTempText(postText);
    setTempImage(postImage);
    setTempViewCount(viewCount);
    setTempDisputeCount(disputeCount);
    setTempProfileInitial(profileInitial);
    setTempProfileName(profileName);
    setTempProfileTime(profileTime);
    setTempSettings(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Edit Post</h3>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Stats & Settings
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Text
              </label>
              <textarea
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's on your mind?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {tempImage ? (
                  <div className="space-y-3">
                    <img
                      src={tempImage}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setTempImage(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No image selected</p>
                  </div>
                )}
                <label className="mt-3 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Stats & Settings Tab */}
        {activeTab === 'stats' && (
          <div className="p-4 space-y-6">
            {/* Profile Info */}
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-medium text-gray-900 mb-3">Profile Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial
                  </label>
                  <input
                    type="text"
                    maxLength={1}
                    value={tempProfileInitial}
                    onChange={(e) => setTempProfileInitial(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={tempProfileName}
                    onChange={(e) => setTempProfileName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={tempProfileTime}
                    onChange={(e) => setTempProfileTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-medium text-gray-900 mb-3">Stats</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    View Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tempViewCount}
                    onChange={(e) => setTempViewCount(parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dispute Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tempDisputeCount}
                    onChange={(e) => setTempDisputeCount(parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Display Settings</h4>
              <div className="space-y-3">
                {[
                  { key: 'blurCounts', label: 'Remove blur from likes & comments' },
                  { key: 'autoIncrement', label: 'Enable automatic view count increments' },
                  { key: 'showDisputeGauge', label: 'Show dispute gauge percentage' },
                  { key: 'showViewDisputes', label: 'Show "View disputes" button' },
                  { key: 'showDisputeFeature', label: 'Show "Dispute this post" button' },
                  { key: 'showDisputeButton', label: 'Show "Dispute" button' },
                  { key: 'showNewGauge', label: 'Show new dispute gauge' },
                  { key: 'showViewsCount', label: 'Show views count text' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">{setting.label}</label>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={tempSettings[setting.key]}
                        onChange={(e) =>
                          setTempSettings((prev: any) => ({
                            ...prev,
                            [setting.key]: e.target.checked
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                          tempSettings[setting.key] ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onClick={() =>
                          setTempSettings((prev: any) => ({
                            ...prev,
                            [setting.key]: !prev[setting.key]
                          }))
                        }
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                            tempSettings[setting.key] ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
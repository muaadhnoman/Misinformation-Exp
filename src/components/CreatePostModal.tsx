import React, { useState } from 'react';
import { X, Image, User, Calendar, Settings, Eye, AlertTriangle } from 'lucide-react';
import { PostData } from '../services/postsService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (postData: Omit<PostData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  template: Omit<PostData, 'id' | 'createdAt' | 'updatedAt'>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
  template
}) => {
  const [postText, setPostText] = useState(template.postText);
  const [postImage, setPostImage] = useState<string | null>(template.postImage);
  const [viewCount, setViewCount] = useState(template.viewCount);
  const [disputeCount, setDisputeCount] = useState(template.disputeCount);
  const [likeCount, setLikeCount] = useState(template.likeCount);
  const [commentCount, setCommentCount] = useState(template.commentCount);
  const [shareCount, setShareCount] = useState(template.shareCount);
  const [profileInitial, setProfileInitial] = useState(template.profileInitial);
  const [profileName, setProfileName] = useState(template.profileName);
  const [profileTime, setProfileTime] = useState(template.profileTime);
  const [settings, setSettings] = useState(template.settings);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const postData: Omit<PostData, 'id' | 'createdAt' | 'updatedAt'> = {
      postText,
      postImage,
      viewCount,
      disputeCount,
      likeCount,
      commentCount,
      shareCount,
      profileInitial,
      profileName,
      profileTime,
      settings,
      comments: []
    };

    onCreatePost(postData);
    // Don't call onClose() here - let the parent handle it after successful creation
  };

  const handleCancel = () => {
    // Reset to template values
    setPostText(template.postText);
    setPostImage(template.postImage);
    setViewCount(template.viewCount);
    setDisputeCount(template.disputeCount);
    setLikeCount(template.likeCount);
    setCommentCount(template.commentCount);
    setShareCount(template.shareCount);
    setProfileInitial(template.profileInitial);
    setProfileName(template.profileName);
    setProfileTime(template.profileTime);
    setSettings(template.settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Create New Post</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Post Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content
              </label>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="What's on your mind?"
              />
            </div>

            {/* Post Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {postImage && (
                  <button
                    onClick={() => setPostImage(null)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              {postImage && (
                <div className="mt-2">
                  <img
                    src={postImage}
                    alt="Post preview"
                    className="max-w-xs h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Initial
                </label>
                <input
                  type="text"
                  value={profileInitial}
                  onChange={(e) => setProfileInitial(e.target.value.charAt(0).toUpperCase())}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Posted
                </label>
                <input
                  type="text"
                  value={profileTime}
                  onChange={(e) => setProfileTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2h, Just now"
                />
              </div>
            </div>

            {/* Post Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Views
                </label>
                <input
                  type="number"
                  value={viewCount}
                  onChange={(e) => setViewCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Disputes
                </label>
                <input
                  type="number"
                  value={disputeCount}
                  onChange={(e) => setDisputeCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Likes
                </label>
                <input
                  type="number"
                  value={likeCount}
                  onChange={(e) => setLikeCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <input
                  type="number"
                  value={commentCount}
                  onChange={(e) => setCommentCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shares
                </label>
                <input
                  type="number"
                  value={shareCount}
                  onChange={(e) => setShareCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            {/* Post Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Settings className="w-4 h-4 inline mr-1" />
                Post Settings
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.blurCounts}
                    onChange={(e) => setSettings({...settings, blurCounts: e.target.checked})}
                    className="mr-2"
                  />
                  Blur Counts
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoIncrement}
                    onChange={(e) => setSettings({...settings, autoIncrement: e.target.checked})}
                    className="mr-2"
                  />
                  Auto Increment
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showDisputeGauge}
                    onChange={(e) => setSettings({...settings, showDisputeGauge: e.target.checked})}
                    className="mr-2"
                  />
                  Show Dispute Gauge
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showViewDisputes}
                    onChange={(e) => setSettings({...settings, showViewDisputes: e.target.checked})}
                    className="mr-2"
                  />
                  Show View Disputes
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showDisputeFeature}
                    onChange={(e) => setSettings({...settings, showDisputeFeature: e.target.checked})}
                    className="mr-2"
                  />
                  Show Dispute Feature
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showDisputeButton}
                    onChange={(e) => setSettings({...settings, showDisputeButton: e.target.checked})}
                    className="mr-2"
                  />
                  Show Dispute Button
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showNewGauge}
                    onChange={(e) => setSettings({...settings, showNewGauge: e.target.checked})}
                    className="mr-2"
                  />
                  Show New Gauge
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showViewsCount}
                    onChange={(e) => setSettings({...settings, showViewsCount: e.target.checked})}
                    className="mr-2"
                  />
                  Show Views Count
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
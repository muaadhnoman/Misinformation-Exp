import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Share2, AlertTriangle, Edit3, MoreHorizontal, Globe, User, Shield, Camera, Upload, X, Check, Eye, ChevronDown } from 'lucide-react';
import EditPostModal from './EditPostModal';
import DisputeModal from './DisputeModal';
import ViewDisputesModal from './ViewDisputesModal';
import EyeGauge from './EyeGauge';
import DisputeGauge from './DisputeGauge';
import { saveSettings, loadSettings, PostSettings, savePostData, loadPostData, PostData } from '../services/settingsService';

interface PostProps {
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  initialViews?: number;
  initialDisputes?: number;
  postId?: string;
}

const Post: React.FC<PostProps> = ({
  initialLikes = 213,
  initialComments = 213,
  initialShares = 213,
  initialViews = 913,
  initialDisputes = 19,
  postId = `post-${Date.now()}`
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [shareCount, setShareCount] = useState(initialShares);
  const [viewCount, setViewCount] = useState(initialViews);
  const [disputeCount, setDisputeCount] = useState(initialDisputes);
  const [postText, setPostText] = useState("Just sharing some thoughts on this beautiful day! What's everyone up to?");
  const [profileInitial, setProfileInitial] = useState('S');
  const [profileName, setProfileName] = useState('Sam Ahmed');
  const [profileTime, setProfileTime] = useState('2h');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isViewDisputesModalOpen, setIsViewDisputesModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: number; text: string; author: string; time: string; initial: string }>>([]);
  const [settings, setSettings] = useState<PostSettings>({
    blurCounts: true,
    autoIncrement: false,
    showDisputeGauge: false,
    showViewDisputes: false,
    showDisputeFeature: false,
    showDisputeButton: false,
    showNewGauge: false,
    showViewsCount: true
  });
  const [hasDisputed, setHasDisputed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoIncrementInterval, setAutoIncrementInterval] = useState<NodeJS.Timeout | null>(null);

  const disputePercentage = Math.round((disputeCount / viewCount) * 100) || 0;

  useEffect(() => {
    const loadPostDataFromDB = async () => {
      try {
        const data = await loadPostData(postId);
        setPostText(data.postText);
        setPostImage(data.postImage);
        setViewCount(data.viewCount);
        setDisputeCount(data.disputeCount);
        setProfileInitial(data.profileInitial);
        setProfileName(data.profileName);
        setProfileTime(data.profileTime);
        setSettings(data.settings);
      } catch (error) {
        console.error('Error loading post data:', error);
      }
    };
    
    loadPostDataFromDB();
  }, [postId]);

  const saveAllPostData = async () => {
    try {
      const postData: PostData = {
        postText,
        postImage,
        viewCount,
        disputeCount,
        profileInitial,
        profileName,
        profileTime,
        settings
      };
      await savePostData(postId, postData);
    } catch (error) {
      console.error('Error saving post data:', error);
    }
  };

  const handleAllDataChange = async (
    newPostText: string,
    newPostImage: string | null,
    newViewCount: number,
    newDisputeCount: number,
    newProfileInitial: string,
    newProfileName: string,
    newProfileTime: string,
    newSettings: PostSettings
  ) => {
    setPostText(newPostText);
    setPostImage(newPostImage);
    setViewCount(newViewCount);
    setDisputeCount(newDisputeCount);
    setProfileInitial(newProfileInitial);
    setProfileName(newProfileName);
    setProfileTime(newProfileTime);
    setSettings(newSettings);
    
    const postData: PostData = {
      postText: newPostText,
      postImage: newPostImage,
      viewCount: newViewCount,
      disputeCount: newDisputeCount,
      profileInitial: newProfileInitial,
      profileName: newProfileName,
      profileTime: newProfileTime,
      settings: newSettings
    };
    await savePostData(postId, postData);
  };

  const handleSettingsChange = async (newSettings: PostSettings) => {
    setSettings(newSettings);
    const postData: PostData = {
      postText,
      postImage,
      viewCount,
      disputeCount,
      profileInitial,
      profileName,
      profileTime,
      settings: newSettings
    };
    await savePostData(postId, postData);
  };

  useEffect(() => {
    if (settings.autoIncrement && !autoIncrementInterval) {
      const interval = setInterval(() => {
        setViewCount(prev => prev + Math.floor(Math.random() * 3));
      }, 10000);
      setAutoIncrementInterval(interval);
    } else if (!settings.autoIncrement && autoIncrementInterval) {
      clearInterval(autoIncrementInterval);
      setAutoIncrementInterval(null);
    }

    return () => {
      if (autoIncrementInterval) clearInterval(autoIncrementInterval);
    };
  }, [settings.autoIncrement, autoIncrementInterval]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentText,
        author: 'Muaadh',
        time: 'Just now',
        initial: 'M'
      };
      setComments(prev => [...prev, newComment]);
      setCommentText('');
      setCommentCount(prev => prev + 1);
      if (settings.autoIncrement) {
        setViewCount(prev => prev + 1);
      }
    }
  };

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

  const handleDispute = () => {
    if (!hasDisputed) {
      setDisputeCount(prev => prev + 1);
      setHasDisputed(true);
    }
  };

  const formatCount = (count: number, isViewCount: boolean = false) => {
    if (settings.blurCounts && !isViewCount) {
      return <span className="blur-sm select-none">{count}</span>;
    }
    return count;
  };

  return (
    <div className="max-w-xl mx-auto my-8 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Post Header */}
        <div className="p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
            {profileInitial}
          </div>
          <div className="flex-grow">
            <div className="font-semibold text-sm text-gray-900">{profileName}</div>
            <div className="text-xs text-gray-500 flex items-center">
              {profileTime} · <Globe className="w-3 h-3 ml-1" />
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Edit3 className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <div className="text-sm text-gray-800 leading-relaxed">{postText}</div>
        </div>

        {/* Post Image */}
        <div className="relative">
          {postImage ? (
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img 
                src={postImage} 
                alt="Post content" 
                className="w-full max-h-[500px] object-contain bg-gray-50"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Click to change image</span>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 h-48 flex items-center justify-center cursor-pointer group hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center text-blue-400 group-hover:text-blue-500 transition-colors">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <span className="text-sm font-medium">Click to add image</span>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Engagement Stats */}
        <div className="px-4 py-2 flex justify-between items-center text-xs text-gray-500 border-b border-gray-100">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-2 h-2 text-white fill-current" />
            </div>
            <span>{formatCount(likeCount)}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div>{formatCount(commentCount)} comments</div>
            <div>{formatCount(shareCount)} shares</div>
            <div className="flex items-center space-x-2">
              {settings.showDisputeGauge && (
                <DisputeGauge 
                  disputeCount={disputeCount} 
                  viewCount={viewCount} 
                  onViewDisputes={() => setIsViewDisputesModalOpen(true)}
                />
              )}
              {settings.showNewGauge && (
                <EyeGauge 
                  viewCount={viewCount} 
                  disputeCount={disputeCount} 
                />
              )}
              {settings.showViewsCount && (
                <div className="flex items-center space-x-1">
                  <span>{formatCount(viewCount, true)} views</span>
                  {settings.showViewDisputes && (
                    <>
                      <span className="text-red-500">({disputePercentage}% disputes)</span>
                      <button 
                        onClick={() => setIsViewDisputesModalOpen(true)}
                        className="text-blue-500 hover:underline"
                      >
                        View disputes
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 flex justify-between border-b border-gray-100">
          <button 
            onClick={handleLike}
            className={`flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex-1 mx-1 ${
              isLiked ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <button 
            onClick={() => document.getElementById('comment-input')?.focus()}
            className="flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-gray-600 text-sm font-medium flex-1 mx-1"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Comment
          </button>
          <button className="flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-gray-600 text-sm font-medium flex-1 mx-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          {settings.showDisputeButton && (
            <button 
              onClick={() => setIsDisputeModalOpen(true)}
              className="flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-gray-600 text-sm font-medium flex-1 mx-1"
            >
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
              Dispute
            </button>
          )}
        </div>

        {/* Dispute Button */}
        {settings.showDisputeFeature && (
          <div className="px-4 py-2 border-b border-gray-100">
            <button 
              onClick={handleDispute}
              disabled={hasDisputed}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md border transition-colors text-sm font-medium ${
                hasDisputed 
                  ? 'bg-red-50 border-red-200 text-red-600 opacity-50 cursor-not-allowed' 
                  : 'border-red-200 text-red-500 hover:bg-red-50'
              }`}
            >
              {hasDisputed ? <Check className="w-4 h-4 mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
              {hasDisputed ? 'Disputed' : 'Dispute this post'}
            </button>
          </div>
        )}

        {/* Comment Section */}
        <div className="px-4 py-3">
          <div className="flex items-start space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              M
            </div>
            <div className="flex-grow">
              <div className="relative">
                <input
                  id="comment-input"
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  className="w-full rounded-full bg-gray-100 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition-colors"
                />
                <button 
                  onClick={handleComment}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {comment.initial}
                  </div>
                  <div className="flex-grow">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                      <div className="font-semibold text-xs text-gray-900">{comment.author}</div>
                      <p className="text-sm text-gray-800">{comment.text}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-2 space-x-2">
                      <button className="hover:underline">Like</button>
                      <span>·</span>
                      <button className="hover:underline">Reply</button>
                      <span>·</span>
                      <span>{comment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        postText={postText}
        postImage={postImage}
        viewCount={viewCount}
        disputeCount={disputeCount}
        profileInitial={profileInitial}
        profileName={profileName}
        profileTime={profileTime}
        settings={settings}
        onSave={handleAllDataChange}
      />

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onDispute={handleDispute}
      />

      <ViewDisputesModal
        isOpen={isViewDisputesModalOpen}
        onClose={() => setIsViewDisputesModalOpen(false)}
        disputeCount={disputeCount}
        setDisputeCount={setDisputeCount}
      />
    </div>
  );
};

export default Post;
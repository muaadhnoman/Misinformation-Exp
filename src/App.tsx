import React, { useState, useEffect, useRef } from 'react';
import Post from './components/Post';
import Login from './components/Login';
import CreatePostModal from './components/CreatePostModal';
import { LogOut, Plus } from 'lucide-react';
import { activityTracker } from './services/activityTrackingService';
import { postsService, PostData } from './services/postsService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAccessCode, setCurrentAccessCode] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const handleLogin = (accessCode: string, adminStatus: boolean) => {
    setIsLoggedIn(true);
    setCurrentAccessCode(accessCode);
    setIsAdmin(adminStatus);
    activityTracker.initializeSession(accessCode);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Load posts when user logs in with real-time updates
  useEffect(() => {
    if (isLoggedIn) {
      setIsLoadingPosts(true);
      
      // Subscribe to real-time updates
      const unsubscribe = postsService.subscribeToAllPosts((posts) => {
        setPosts(posts);
        setIsLoadingPosts(false);
      });

      unsubscribeRef.current = unsubscribe;

      // Cleanup subscription on unmount
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    }
  }, [isLoggedIn]);

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const posts = await postsService.getAllPosts();
      setPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleCreatePost = async (postData: Omit<PostData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPostId = await postsService.createPost(postData);
      if (newPostId) {
        // Posts will update automatically via real-time listener
        console.log('Post created successfully:', newPostId);
        // Close modal after successful creation
        setIsCreatePostModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex justify-between mb-4">
          {isAdmin && (
            <button
              onClick={() => setIsCreatePostModalOpen(true)}
              className="flex items-center px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </button>
          )}
          <div className={isAdmin ? '' : 'ml-auto'}>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        {isLoadingPosts ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts yet.</p>
                {isAdmin && (
                  <p className="text-sm text-gray-400 mt-2">As an admin, you can create the first post!</p>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <Post 
                  key={post.id}
                  postId={post.id}
                  postData={post}
                  isAdmin={isAdmin}
                />
              ))
            )}
          </>
        )}
      </div>
      
      {/* Create Post Modal */}
      <CreatePostModal
        key={isCreatePostModalOpen ? 'open' : 'closed'}
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onCreatePost={handleCreatePost}
        template={postsService.getPostTemplate()}
      />
    </div>
  );
}

export default App;
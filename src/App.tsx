import React, { useState } from 'react';
import Post from './components/Post';
import Login from './components/Login';
import { LogOut } from 'lucide-react';
import { activityTracker } from './services/activityTrackingService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAccessCode, setCurrentAccessCode] = useState<string>('');

  const handleLogin = (accessCode: string) => {
    setIsLoggedIn(true);
    setCurrentAccessCode(accessCode);
    activityTracker.initializeSession(accessCode);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
        <Post postId="post-1" />
        <Post postId="post-2" />
        <Post postId="post-3" />
      </div>
    </div>
  );
}

export default App;
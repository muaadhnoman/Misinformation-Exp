import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: (accessCode: string, isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize default codes on component mount
    authService.initializeDefaultCodes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.validateAccessCode(code);
      if (result.isValid) {
        onLogin(code, result.isAdmin);
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <Lock className="mx-auto mb-4 text-gray-600" size={48} />
          <h1 className="text-2xl font-bold text-gray-800">Enter Access Code</h1>
          <p className="text-gray-600 mt-2">Please enter the access code to continue</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder="Enter code"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Access'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
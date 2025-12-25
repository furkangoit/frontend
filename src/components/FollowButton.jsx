import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FollowButton = ({ targetUserId, isInitiallyFollowing = false }) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(isInitiallyFollowing);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Mevcut takip durumunu kontrol et
  useEffect(() => {
    checkFollowStatus();
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    if (!user || !targetUserId) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}/follow-stats`);
      const isFollowing = response.data.following?.includes(targetUserId) || false;
      setFollowing(isFollowing);
      setDebugInfo(`Status: ${isFollowing ? 'Following' : 'Not following'}`);
    } catch (error) {
      console.log('Follow status check failed, using initial value');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      alert('⚠️ Giriş yapmalısınız!');
      return;
    }
    
    if (user.id === targetUserId) {
      alert('ℹ️ Kendinizi takip edemezsiniz!');
      return;
    }

    setLoading(true);
    setDebugInfo('Sending request...');
    
    try {
      console.log(`📤 Follow API Request:`, {
        url: `http://localhost:5000/api/users/${targetUserId}/follow`,
        data: { followerId: user.id }
      });
      
      const response = await axios.post(
        `http://localhost:5000/api/users/${targetUserId}/follow`,
        { followerId: user.id },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );

      console.log('✅ Follow API Response:', response.data);
      
      if (response.data.success) {
        setFollowing(response.data.following);
        setDebugInfo(`Success: ${response.data.message}`);
        
        alert(`✅ ${response.data.message}`);
      } else {
        setDebugInfo(`Error: ${response.data.error}`);
        alert(`❌ ${response.data.error}`);
      }
      
    } catch (error) {
      console.error('❌ Follow API Error:', error);
      
      const errorMsg = error.response?.data?.error || 
                      error.message || 
                      'API bağlantı hatası';
      
      setDebugInfo(`Failed: ${errorMsg}`);
      alert(`❌ Takip işlemi başarısız: ${errorMsg}`);
      
      // Fallback: toggle locally
      setFollowing(!following);
    } finally {
      setLoading(false);
    }
  };

  console.log('🔍 FollowButton Debug:', {
    user: user?.id,
    targetUserId,
    following,
    loading
  });

  if (!user) {
    return (
      <div className="text-center">
        <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-full">
          Giriş yapmalısınız
        </button>
      </div>
    );
  }

  if (user.id === targetUserId) {
    return (
      <div className="text-center">
        <button disabled className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full">
          Bu sensin
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-medium transition-all shadow-md ${
          following
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
        style={{ minWidth: '140px' }}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>...</span>
          </div>
        ) : following ? (
          <>
            <FaUserCheck />
            <span>Takip Ediliyor</span>
          </>
        ) : (
          <>
            <FaUserPlus />
            <span>Takip Et</span>
          </>
        )}
      </button>
      
      {/* Debug info */}
      <div className="mt-2 text-xs text-gray-500">
        <div>User: {user.id} → Target: {targetUserId}</div>
        <div>{debugInfo}</div>
      </div>
    </div>
  );
};

export default FollowButton;
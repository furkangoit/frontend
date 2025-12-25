import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FollowButton from '../components/FollowButton';
import { FaUser, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

const Profile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchFollowStats();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users`);
      const foundUser = response.data.find(u => u.id === parseInt(userId));
      if (foundUser) {
        setUser(foundUser);
      }
    } catch (error) {
      console.error('Profil yüklenemedi:', error);
    }
  };

  const fetchFollowStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/follow-stats`);
      setStats({
        followers: response.data.followerCount || 0,
        following: response.data.followingCount || 0
      });
    } catch (error) {
      console.error('Takip istatistikleri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Kullanıcı bulunamadı</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profil Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold">{user.fullName || user.username}</h1>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center space-x-4 mt-4 text-gray-700">
                <span className="flex items-center">
                  <FaUser className="mr-2" />
                  {stats.followers} takipçi
                </span>
                <span className="flex items-center">
                  <FaUser className="mr-2" />
                  {stats.following} takip edilen
                </span>
                <span className="flex items-center">
                  <FaCalendar className="mr-2" />
                  Aralık 2024'ten beri
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <FollowButton 
              targetUserId={parseInt(userId)}
              isInitiallyFollowing={false}
            />
            <div className="mt-2 text-xs text-gray-500 text-center">
              User ID: {userId}
            </div>
          </div>
        </div>
        
        {/* Bio */}
        <div className="mt-6">
          <p className="text-gray-800">{user.bio || "Bio henüz eklenmedi."}</p>
          <div className="flex items-center mt-2 text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>İstanbul, Türkiye</span>
          </div>
        </div>
      </div>

      {/* Kullanıcının Gönderileri */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Gönderiler</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Henüz gönderi yok</p>
          <p className="text-sm mt-2">Kullanıcı henüz bir gönderi paylaşmadı</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
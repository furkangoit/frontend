// Profile.jsx - Düzeltilmiş
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Post from '../components/Post';
import { samplePosts, sampleUsers } from '../data/sampleData';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const user = sampleUsers[0]; // İlk kullanıcıyı al
  const userPosts = samplePosts.filter(post => post.userId === user.id);

  return (
    <div className="profile-container">
      <Navigation />
      
      <main className="profile-content">
        {/* ... diğer kodlar aynı ... */}

        <div className="profile-posts">
          {activeTab === 'posts' && (
            userPosts.length > 0 ? (
              userPosts.map(post => (
                <Post 
                  key={post.id}
                  user={post.user} 
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                  time={post.createdAt}
                  image={post.image}
                />
              ))
            ) : (
              <div className="no-posts">
                <p>Henüz gönderi yok.</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
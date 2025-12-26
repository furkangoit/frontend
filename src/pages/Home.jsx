// Home.jsx - Düzeltilmiş
import React from 'react';
import Navigation from '../components/Navigation';
import Post from '../components/Post';
import { samplePosts } from '../data/sampleData';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navigation />
      
      <main className="home-content">
        <div className="welcome-section">
          <h1>Hoş Geldiniz!</h1>
          <p>SocialApp'e hoş geldiniz. Arkadaşlarınızla bağlantı kurun, paylaşın ve keşfedin.</p>
        </div>

        <div className="create-post">
          <textarea placeholder="Neler oluyor?" rows="3"></textarea>
          <button className="post-button">Paylaş</button>
        </div>

        <div className="feed">
          <h2>Son Gönderiler</h2>
          {samplePosts.map(post => (
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
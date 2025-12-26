import React from 'react';
import Navigation from '../components/Navigation';
import './Explore.css';

const Explore = () => {
  const trendingTopics = [
    { id: 1, name: 'Teknoloji', count: 1245 },
    { id: 2, name: 'Spor', count: 987 },
    { id: 3, name: 'Müzik', count: 876 },
    { id: 4, name: 'Sanat', count: 654 },
    { id: 5, name: 'Bilim', count: 543 },
  ];

  return (
    <div className="explore-container">
      <Navigation />
      
      <main className="explore-content">
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Keşfetmek istediğin konuyu ara..."
            className="search-input"
          />
        </div>

        <div className="trending-section">
          <h2>Popüler Konular</h2>
          <div className="trending-list">
            {trendingTopics.map(topic => (
              <div key={topic.id} className="topic-card">
                <h3>#{topic.name}</h3>
                <p>{topic.count.toLocaleString()} gönderi</p>
              </div>
            ))}
          </div>
        </div>

        <div className="discover-section">
          <h2>Yeni İnsanlar Keşfet</h2>
          <div className="user-grid">
            {/* Kullanıcı kartları buraya gelecek */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
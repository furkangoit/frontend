import React from 'react';
import './Sidebar.css';

function Sidebar() {
  const trends = [
    { tag: '#ReactJS', tweets: '15.2K', category: 'Teknoloji' },
    { tag: '#JavaScript', tweets: '22.5K', category: 'Programlama' },
    { tag: '#WebDevelopment', tweets: '18.7K', category: 'Geliştirme' },
    { tag: '#Startup', tweets: '12.3K', category: 'İş' },
    { tag: '#AI', tweets: '45.8K', category: 'Teknoloji' }
  ];

  const whoToFollow = [
    { name: 'React', username: '@reactjs', avatar: 'https://i.pravatar.cc/40?img=1' },
    { name: 'Node.js', username: '@nodejs', avatar: 'https://i.pravatar.cc/40?img=2' },
    { name: 'Next.js', username: '@nextjs', avatar: 'https://i.pravatar.cc/40?img=3' }
  ];

  return (
    <aside className="sidebar">
      {/* TRENDLER */}
      <div className="trends-section">
        <h3 className="sidebar-title">Trendler</h3>
        {trends.map((trend, index) => (
          <div key={index} className="trend-item">
            <div className="trend-category">{trend.category} · Trend</div>
            <div className="trend-tag">{trend.tag}</div>
            <div className="trend-tweets">{trend.tweets} post</div>
          </div>
        ))}
        <button className="show-more">Daha fazla göster</button>
      </div>

      {/* KİMLERİ TAKİP ETMELİ */}
      <div className="follow-section">
        <h3 className="sidebar-title">Kimleri takip etmeli</h3>
        {whoToFollow.map((user, index) => (
          <div key={index} className="follow-item">
            <img src={user.avatar} alt={user.name} className="follow-avatar" />
            <div className="follow-info">
              <div className="follow-name">{user.name}</div>
              <div className="follow-username">{user.username}</div>
            </div>
            <button className="follow-button">Takip et</button>
          </div>
        ))}
      </div>

      {/* FOOTER LINKS */}
      <div className="sidebar-footer">
        <a href="/terms">Şartlar</a>
        <a href="/privacy">Gizlilik Politikası</a>
        <a href="/cookies">Çerezler</a>
        <a href="/ads">Reklam Bilgisi</a>
        <a href="/more">Daha fazla</a>
        <div className="copyright">© 2024 SocialApp</div>
      </div>
    </aside>
  );
}

export default Sidebar;
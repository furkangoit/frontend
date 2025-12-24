import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import Post from "../components/Post";
import CreatePost from "../components/CreatePost";
import { FaSpinner } from "react-icons/fa";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/feed");
      setPosts(response.data);
      setError("");
    } catch (err) {
      setError("Gönderiler yüklenemedi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const updatePost = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" size={40} />
        <p>Gönderiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2>Ana Sayfa</h2>
        <p>Takip ettiğin kişilerin gönderileri</p>
      </div>

      <CreatePost onPostCreated={addPost} />

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchFeed}>Tekrar Dene</button>
        </div>
      )}

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <h3>Henüz gönderi yok</h3>
            <p>İnsanları takip ederek gönderilerini görebilirsin</p>
            <button onClick={() => window.location.href = "/explore"}>
              Keşfet
            </button>
          </div>
        ) : (
          posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              currentUser={user}
              onUpdate={updatePost}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
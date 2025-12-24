import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { FaImage, FaSmile, FaMapMarkerAlt } from "react-icons/fa";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/posts", {
        content,
        image: image || null
      });
      
      onPostCreated(response.data.post);
      setContent("");
      setImage("");
    } catch (err) {
      console.error("Gönderi oluşturma hatası:", err);
      alert("Gönderi paylaşılamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <img src={user?.avatar} alt={user?.username} className="post-avatar" />
        <div>
          <h4>{user?.fullName}</h4>
          <span>@{user?.username}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Ne düşünüyorsun, ${user?.fullName}?`}
          maxLength={500}
        />

        {image && (
          <div className="image-preview">
            <img src={image} alt="Preview" />
            <button type="button" onClick={() => setImage("")}>
              ✕
            </button>
          </div>
        )}

        <div className="create-post-actions">
          <div className="post-attachments">
            <button type="button" onClick={() => setImage("https://images.unsplash.com/photo-1506744038136-46273834b3fb")}>
              <FaImage /> Fotoğraf
            </button>
            <button type="button">
              <FaSmile /> Emoji
            </button>
            <button type="button">
              <FaMapMarkerAlt /> Konum
            </button>
          </div>
          
          <button 
            type="submit" 
            className="submit-post"
            disabled={!content.trim() || loading}
          >
            {loading ? "Paylaşılıyor..." : "Paylaş"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
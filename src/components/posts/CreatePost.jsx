import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;

		setLoading(true);
		try {
			const response = await axios.post('http://localhost:5000/api/posts', {
				title: 'Yeni Gönderi',
				content: content,
				author: 'Kullanıcı'
			});

			setContent('');
			setSelectedImage(null);
			if (onPostCreated) onPostCreated(response.data.data);
			alert('✅ Gönderi paylaşıldı!');
		} catch (error) {
			console.error('Gönderi oluşturulamadı:', error);
			alert('❌ Gönderi paylaşılamadı');
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="create-post-card">
			<div className="create-post-header">
				<img 
					src="https://i.pravatar.cc/48"
					alt="Profil"
					className="create-post-avatar"
				/>
				<form onSubmit={handleSubmit} className="create-post-form">
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Neler oluyor?"
						className="create-post-input"
						rows="3"
						disabled={loading}
					/>
          
					{selectedImage && (
						<div className="image-preview">
							<img src={selectedImage} alt="Preview" />
							<button 
								type="button"
								onClick={() => setSelectedImage(null)}
								className="remove-image"
							>
								✕
							</button>
						</div>
					)}
          
					<div className="create-post-actions">
						<div className="action-icons">
							<label className="icon-btn">
								📷
								<input 
									type="file" 
									accept="image/*"
									onChange={handleImageUpload}
									className="file-input"
								/>
							</label>
							<button type="button" className="icon-btn">😊</button>
							<button type="button" className="icon-btn">📍</button>
							<button type="button" className="icon-btn">📊</button>
						</div>
            
						<button 
							type="submit" 
							className="post-submit-btn"
							disabled={!content.trim() || loading}
						>
							{loading ? 'Paylaşılıyor...' : 'Paylaş'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreatePost;

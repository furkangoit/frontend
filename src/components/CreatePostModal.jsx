// src/components/CreatePostModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { createPost } from '../services/api';

function CreatePostModal({ show, onHide, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Lütfen başlık ve içerik giriniz');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        image: '', // İsterseniz resim ekleyebilirsiniz
      };

      const response = await createPost(newPost);
      
      // Formu temizle
      setTitle('');
      setContent('');
      
      // Başarılı callback
      if (onSuccess) {
        onSuccess(response.post || response);
      }
      
      // Modal'ı kapat
      onHide();
    } catch (err) {
      setError('Gönderi oluşturulamadı. Lütfen tekrar deneyin.');
      console.error('Gönderi oluşturma hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Yeni Gönderi Oluştur</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Başlık</Form.Label>
            <Form.Control
              type="text"
              placeholder="Gönderi başlığını girin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>İçerik</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Gönderi içeriğini girin"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              İptal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Paylaşılıyor...
                </>
              ) : 'Paylaş'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreatePostModal;
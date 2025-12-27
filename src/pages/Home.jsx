// src/pages/Home.jsx - GERÇEK ZAMANLI VERSİYON
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Row, Col, Card, Button, Spinner, Form, 
  Badge, ListGroup, Alert, Modal, InputGroup, FormControl 
} from 'react-bootstrap';
import { 
  getPosts, getUsers, createPost, likePost, addComment,
  connectSocket, onPostCreated, onPostLiked, onCommentAdded, onOnlineUsers
} from '../services/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const commentInputRef = useRef(null);

  // İlk yükleme
  useEffect(() => {
    loadInitialData();
    setupSocketListeners();
    
    return () => {
      // Cleanup
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [postsData, usersData] = await Promise.all([
        getPosts(1, 10),
        getUsers()
      ]);
      
      setPosts(postsData.posts || []);
      setUsers(usersData.users || []);
      setHasMore(postsData.total > postsData.posts.length);
    } catch (error) {
      console.error('Başlangıç verisi yüklenemedi:', error);
      // Mock data fallback
      setPosts([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    const socket = connectSocket();
    
    // Yeni gönderi
    const unsubscribePost = onPostCreated((newPost) => {
      setPosts(prev => [newPost, ...prev]);
    });
    
    // Beğeni
    const unsubscribeLike = onPostLiked(({ postId, likes }) => {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes } : post
      ));
    });
    
    // Yeni yorum
    const unsubscribeComment = onCommentAdded(({ postId, comment }) => {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, comment] }
          : post
      ));
    });
    
    // Çevrimiçi kullanıcılar
    const unsubscribeOnline = onOnlineUsers((count) => {
      setOnlineUsers(count);
    });
    
    return () => {
      unsubscribePost();
      unsubscribeLike();
      unsubscribeComment();
      unsubscribeOnline();
    };
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await getPosts(nextPage, 10);
      
      setPosts(prev => [...prev, ...(data.posts || [])]);
      setPage(nextPage);
      setHasMore(data.total > posts.length + data.posts.length);
    } catch (error) {
      console.error('Daha fazla gönderi yüklenemedi:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Lütfen başlık ve içerik giriniz');
      return;
    }

    try {
      const postData = {
        title: newPost.title,
        content: newPost.content,
        authorId: 1 // Mevcut kullanıcı ID'si
      };
      
      await createPost(postData);
      setNewPost({ title: '', content: '' });
    } catch (error) {
      console.error('Gönderi oluşturulamadı:', error);
      alert('Gönderi oluşturulamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      // Socket üzerinden otomatik güncellenecek
    } catch (error) {
      console.error('Beğeni gönderilemedi:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      const commentData = {
        text: commentText,
        author: 'Mevcut Kullanıcı'
      };
      
      await addComment(postId, commentData);
      setNewComment(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Yorum eklenemedi:', error);
    }
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'popular') return post.likes > 20;
    if (activeTab === 'recent') {
      const postDate = new Date(post.createdAt);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return postDate > yesterday;
    }
    return true;
  });

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <h4 className="mt-3">SocialApp Yükleniyor...</h4>
          <p>Gerçek zamanlı sosyal medya deneyimi hazırlanıyor</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      {/* Üst Navbar */}
      <nav className="navbar navbar-dark bg-primary shadow">
        <Container>
          <span className="navbar-brand mb-0 h1">
            <span className="me-2">🚀</span>
            SocialApp
            <Badge bg="light" text="primary" className="ms-2">
              Beta
            </Badge>
          </span>
          
          <div className="d-flex align-items-center">
            <Badge bg="success" className="me-3">
              🔴 {onlineUsers} Çevrimiçi
            </Badge>
            <Button variant="light" size="sm">
              👤 Profilim
            </Button>
          </div>
        </Container>
      </nav>

      <Container className="py-4">
        <Row>
          {/* Sol Sidebar */}
          <Col lg={3} className="mb-4">
            <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px', fontSize: '30px' }}>
                    👤
                  </div>
                  <h5 className="mt-3 mb-0">Mevcut Kullanıcı</h5>
                  <small className="text-muted">@kullanici1</small>
                </div>

                <ListGroup variant="flush">
                  <ListGroup.Item action active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                    📰 Tüm Gönderiler
                  </ListGroup.Item>
                  <ListGroup.Item action active={activeTab === 'popular'} onClick={() => setActiveTab('popular')}>
                    🔥 Popüler
                  </ListGroup.Item>
                  <ListGroup.Item action active={activeTab === 'recent'} onClick={() => setActiveTab('recent')}>
                    ⏰ Son 24 Saat
                  </ListGroup.Item>
                  <ListGroup.Item action>
                    👥 Takip Ettiklerim
                  </ListGroup.Item>
                  <ListGroup.Item action>
                    💾 Kaydedilenler
                  </ListGroup.Item>
                </ListGroup>

                <hr />

                <h6>Trend Konular</h6>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="secondary" className="cursor-pointer">#React</Badge>
                  <Badge bg="secondary" className="cursor-pointer">#NodeJS</Badge>
                  <Badge bg="secondary" className="cursor-pointer">#MongoDB</Badge>
                  <Badge bg="secondary" className="cursor-pointer">#WebDev</Badge>
                  <Badge bg="secondary" className="cursor-pointer">#Startup</Badge>
                </div>
              </Card.Body>
            </Card>

            {/* Çevrimiçi Kullanıcılar */}
            <Card className="mt-3 shadow-sm">
              <Card.Body>
                <h6>👥 Çevrimiçi Arkadaşlar</h6>
                <ListGroup variant="flush">
                  {users.slice(0, 5).map(user => (
                    <ListGroup.Item key={user.id} className="d-flex align-items-center">
                      <div className={`rounded-circle me-2 ${user.online ? 'bg-success' : 'bg-secondary'}`} 
                           style={{ width: '10px', height: '10px' }} />
                      <span>{user.name}</span>
                      {user.online && (
                        <Badge bg="success" size="sm" className="ms-auto">Çevrimiçi</Badge>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Ana İçerik */}
          <Col lg={6} className="mb-4">
            {/* Yeni Gönderi Kartı */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '50px', height: '50px', fontSize: '24px' }}>
                    👤
                  </div>
                  <div>
                    <h6 className="mb-0">Mevcut Kullanıcı</h6>
                    <small className="text-muted">Neler oluyor?</small>
                  </div>
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Başlık"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="mb-2"
                    />
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="İçeriğinizi yazın..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Button variant="outline-secondary" size="sm" className="me-2">
                        📷 Fotoğraf
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        🎥 Video
                      </Button>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={handleCreatePost}
                      disabled={!newPost.title.trim() || !newPost.content.trim()}
                    >
                      Paylaş
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Filtreler */}
            <div className="d-flex gap-2 mb-3">
              <Button 
                variant={activeTab === 'all' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                Tümü
              </Button>
              <Button 
                variant={activeTab === 'popular' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setActiveTab('popular')}
              >
                Popüler
              </Button>
              <Button 
                variant={activeTab === 'recent' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setActiveTab('recent')}
              >
                Son 24 Saat
              </Button>
            </div>

            {/* Gönderi Listesi */}
            {filteredPosts.length === 0 ? (
              <Card className="text-center p-5 shadow-sm">
                <h5>Gönderi bulunamadı</h5>
                <p className="text-muted">Filtrenize uygun gönderi yok veya henüz gönderi paylaşılmamış.</p>
                <Button variant="primary" onClick={() => setActiveTab('all')}>
                  Tüm Gönderileri Gör
                </Button>
              </Card>
            ) : (
              <>
                {filteredPosts.map(post => (
                  <Card key={post.id} className="mb-4 shadow-sm">
                    <Card.Body>
                      {/* Gönderi Başlığı */}
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '50px', height: '50px', fontSize: '20px' }}
                        >
                          {post.author?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h6 className="mb-0">{post.author?.name || 'Anonim'}</h6>
                          <small className="text-muted">
                            {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                        <Badge bg="secondary" className="ms-auto">
                          #{post.id}
                        </Badge>
                      </div>

                      {/* Gönderi İçeriği */}
                      <Card.Title>{post.title}</Card.Title>
                      <Card.Text className="mb-3">{post.content}</Card.Text>
                      
                      {/* Gönderi Resmi */}
                      {post.image && (
                        <div className="mb-3">
                          <img 
                            src={post.image} 
                            alt="Gönderi resmi" 
                            className="img-fluid rounded"
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      {/* İstatistikler */}
                      <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="d-flex align-items-center"
                        >
                          <span className="me-2">❤️</span>
                          {post.likes} Beğeni
                        </Button>
                        
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => openCommentModal(post)}
                          className="d-flex align-items-center"
                        >
                          <span className="me-2">💬</span>
                          {post.comments?.length || 0} Yorum
                        </Button>
                        
                        <Button variant="outline-secondary" size="sm">
                          <span className="me-2">🔗</span>
                          Paylaş
                        </Button>
                        
                        <Button variant="outline-secondary" size="sm">
                          <span className="me-2">💾</span>
                          Kaydet
                        </Button>
                      </div>

                      {/* Yorum Formu */}
                      <div className="mt-3">
                        <InputGroup>
                          <FormControl
                            placeholder="Yorum yaz..."
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ 
                              ...prev, 
                              [post.id]: e.target.value 
                            }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <Button 
                            variant="primary"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                          >
                            Gönder
                          </Button>
                        </InputGroup>
                      </div>

                      {/* Yorumlar */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="mt-3">
                          <h6>Son Yorumlar:</h6>
                          {post.comments.slice(-2).map(comment => (
                            <div key={comment.id} className="d-flex align-items-start mb-2 p-2 bg-light rounded">
                              <strong className="me-2">{comment.author}:</strong>
                              <span>{comment.text}</span>
                              <small className="text-muted ms-auto">
                                {new Date(comment.createdAt).toLocaleTimeString('tr-TR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </small>
                            </div>
                          ))}
                          {post.comments.length > 2 && (
                            <Button 
                              variant="link" 
                              size="sm"
                              onClick={() => openCommentModal(post)}
                            >
                              Tüm yorumları gör ({post.comments.length})
                            </Button>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}

                {/* Daha Fazla Yükle */}
                {hasMore && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline-primary" 
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-5"
                    >
                      {loadingMore ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Yükleniyor...
                        </>
                      ) : 'Daha Fazla Göster'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Col>

          {/* Sağ Sidebar */}
          <Col lg={3}>
            {/* Sistem Durumu */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h6>📊 Sistem Durumu</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Frontend:</span>
                  <Badge bg="success">Aktif</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Backend API:</span>
                  <Badge bg="success">Çalışıyor</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Socket.IO:</span>
                  <Badge bg="success">Bağlı</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Toplam Gönderi:</span>
                  <Badge bg="info">{posts.length}</Badge>
                </div>
              </Card.Body>
            </Card>

            {/* Aktivite */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h6>📈 Son Aktivite</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex align-items-center">
                    <span className="me-2">👤</span>
                    <div>
                      <small>Ahmet Yılmaz yeni gönderi paylaştı</small>
                      <div className="text-muted" style={{ fontSize: '0.8em' }}>2 dakika önce</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center">
                    <span className="me-2">❤️</span>
                    <div>
                      <small>Ayşe Kaya gönderinizi beğendi</small>
                      <div className="text-muted" style={{ fontSize: '0.8em' }}>15 dakika önce</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center">
                    <span className="me-2">💬</span>
                    <div>
                      <small>Mehmet Demir yorum yaptı</small>
                      <div className="text-muted" style={{ fontSize: '0.8em' }}>1 saat önce</div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            {/* Hızlı İşlemler */}
            <Card className="shadow-sm">
              <Card.Body>
                <h6>⚡ Hızlı İşlemler</h6>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    🔍 Gönderi Ara
                  </Button>
                  <Button variant="outline-success" size="sm">
                    👥 Arkadaş Bul
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    ⚙️ Ayarlar
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    🚪 Çıkış Yap
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Yorum Modal'ı */}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>💬 Tüm Yorumlar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <>
              <div className="mb-4 p-3 bg-light rounded">
                <h6>{selectedPost.author?.name}</h6>
                <p>{selectedPost.content}</p>
              </div>
              
              <h6>Yorumlar ({selectedPost.comments?.length || 0})</h6>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedPost.comments?.map(comment => (
                  <div key={comment.id} className="mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between">
                      <strong>{comment.author}</strong>
                      <small className="text-muted">
                        {new Date(comment.createdAt).toLocaleString('tr-TR')}
                      </small>
                    </div>
                    <p className="mb-0 mt-2">{comment.text}</p>
                  </div>
                )) || (
                  <p className="text-muted text-center py-4">Henüz yorum yok. İlk yorumu siz yapın!</p>
                )}
              </div>
              
              <InputGroup className="mt-4">
                <FormControl
                  ref={commentInputRef}
                  placeholder="Yorumunuzu yazın..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && selectedPost) {
                      handleAddComment(selectedPost.id);
                    }
                  }}
                  onChange={(e) => setNewComment(prev => ({ 
                    ...prev, 
                    [selectedPost.id]: e.target.value 
                  }))}
                  value={newComment[selectedPost.id] || ''}
                />
                <Button 
                  variant="primary"
                  onClick={() => selectedPost && handleAddComment(selectedPost.id)}
                  disabled={!newComment[selectedPost.id]?.trim()}
                >
                  Gönder
                </Button>
              </InputGroup>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <Container>
          <Row>
            <Col md={4}>
              <h5>SocialApp</h5>
              <p className="text-muted">Gerçek zamanlı sosyal medya deneyimi</p>
            </Col>
            <Col md={4}>
              <h6>Bağlantılar</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white-50">Hakkımızda</a></li>
                <li><a href="#" className="text-white-50">Gizlilik</a></li>
                <li><a href="#" className="text-white-50">Kullanım Şartları</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h6>Sistem</h6>
              <p className="text-muted mb-0">
                Backend: localhost:5000<br />
                Frontend: localhost:3000<br />
                Socket: Aktif
              </p>
            </Col>
          </Row>
          <hr className="bg-secondary" />
          <p className="text-center text-muted mb-0">
            © 2024 SocialApp - Tüm hakları saklıdır
          </p>
        </Container>
      </footer>
    </Container>
  );
}

export default Home;
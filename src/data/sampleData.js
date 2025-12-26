// sampleData.js - SocialApp Örnek Verileri

// Örnek Kullanıcılar
export const sampleUsers = [
  {
    id: 1,
    name: "Furkan Yılmaz",
    username: "@furkan_y",
    email: "furkan@example.com",
    bio: "Frontend Developer | React Enthusiast | Tech Lover",
    location: "İstanbul, Türkiye",
    website: "https://furkan.dev",
    joinDate: "Ocak 2023",
    avatar: "https://ui-avatars.com/api/?name=Furkan+Yılmaz&background=667eea&color=fff&size=150",
    coverPhoto: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80",
    following: 342,
    followers: 1245,
    posts: 56,
    online: true,
    verified: true
  },
  {
    id: 2,
    name: "Ahmet Demir",
    username: "@ahmet_d",
    email: "ahmet@example.com",
    bio: "Backend Developer | Node.js Specialist",
    location: "Ankara, Türkiye",
    website: "https://ahmetdev.com",
    joinDate: "Mart 2022",
    avatar: "https://ui-avatars.com/api/?name=Ahmet+Demir&background=764ba2&color=fff&size=150",
    coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80",
    following: 289,
    followers: 987,
    posts: 42,
    online: true,
    verified: false
  },
  {
    id: 3,
    name: "Ayşe Kaya",
    username: "@ayse_k",
    email: "ayse@example.com",
    bio: "UI/UX Designer | Figma Expert",
    location: "İzmir, Türkiye",
    website: "https://ayse.design",
    joinDate: "Haziran 2023",
    avatar: "https://ui-avatars.com/api/?name=Ayşe+Kaya&background=ff6b6b&color=fff&size=150",
    coverPhoto: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80",
    following: 456,
    followers: 1567,
    posts: 89,
    online: false,
    verified: true
  },
  {
    id: 4,
    name: "Mehmet Şahin",
    username: "@mehmet_s",
    email: "mehmet@example.com",
    bio: "Full Stack Developer | JavaScript Lover",
    location: "Bursa, Türkiye",
    website: "https://mehmetcodes.com",
    joinDate: "Eylül 2022",
    avatar: "https://ui-avatars.com/api/?name=Mehmet+Şahin&background=2ed573&color=fff&size=150",
    coverPhoto: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80",
    following: 521,
    followers: 2345,
    posts: 123,
    online: true,
    verified: true
  },
  {
    id: 5,
    name: "Zeynep Yıldız",
    username: "@zeynep_y",
    email: "zeynep@example.com",
    bio: "Mobile Developer | React Native",
    location: "Antalya, Türkiye",
    website: "https://zeynep.dev",
    joinDate: "Aralık 2023",
    avatar: "https://ui-avatars.com/api/?name=Zeynep+Yıldız&background=ffa502&color=fff&size=150",
    coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80",
    following: 198,
    followers: 654,
    posts: 34,
    online: false,
    verified: false
  }
];

// Örnek Gönderiler
export const samplePosts = [
  {
    id: 1,
    userId: 1,
    user: sampleUsers[0],
    content: "Bugün React 18'in yeni özelliklerini inceledim. Concurrent rendering gerçekten harika! 🚀 #React #Frontend #WebDevelopment",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likes: 245,
    comments: 42,
    shares: 18,
    createdAt: "2 saat önce",
    isLiked: false,
    isSaved: false,
    tags: ["react", "frontend", "javascript"]
  },
  {
    id: 2,
    userId: 2,
    user: sampleUsers[1],
    content: "Node.js ile mikroservis mimarisi üzerine çalışıyorum. Docker ve Kubernetes entegrasyonu tamamlandı! 🐳 #NodeJS #Backend #Microservices",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likes: 189,
    comments: 28,
    shares: 12,
    createdAt: "4 saat önce",
    isLiked: true,
    isSaved: true,
    tags: ["nodejs", "backend", "docker"]
  },
  {
    id: 3,
    userId: 3,
    user: sampleUsers[2],
    content: "Yeni bir UI kit tasarladım! Dark mode, responsive design ve accessibility ön planda. Figma dosyasını paylaşacağım. 🎨 #UIUX #Design #Figma",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likes: 312,
    comments: 56,
    shares: 24,
    createdAt: "1 gün önce",
    isLiked: false,
    isSaved: true,
    tags: ["design", "figma", "uiux"]
  },
  {
    id: 4,
    userId: 4,
    user: sampleUsers[3],
    content: "Full stack projemi tamamladım! Frontend: React, Backend: Node.js, Database: MongoDB. Open source olarak yayınlayacağım. 💻 #FullStack #MongoDB #JavaScript",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likes: 421,
    comments: 78,
    shares: 35,
    createdAt: "2 gün önce",
    isLiked: true,
    isSaved: false,
    tags: ["fullstack", "mongodb", "webdev"]
  },
  {
    id: 5,
    userId: 1,
    user: sampleUsers[0],
    content: "TypeScript ile type safety sağlamak projelerimdeki bug'ları %70 azalttı. Kesinlikle öneriyorum! 📝 #TypeScript #WebDevelopment",
    image: null,
    likes: 156,
    comments: 23,
    shares: 9,
    createdAt: "3 gün önce",
    isLiked: false,
    isSaved: true,
    tags: ["typescript", "programming"]
  },
  {
    id: 6,
    userId: 5,
    user: sampleUsers[4],
    content: "React Native ile cross-platform mobil uygulama geliştirmek gerçekten zaman kazandırıyor. Özellikle hot reload mükemmel! 📱 #ReactNative #Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likes: 278,
    comments: 45,
    shares: 21,
    createdAt: "4 gün önce",
    isLiked: true,
    isSaved: false,
    tags: ["reactnative", "mobile", "app"]
  }
];

// Örnek Yorumlar
export const sampleComments = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    user: sampleUsers[1],
    content: "Harika bilgiler! React 18'i ben de merak ediyordum.",
    likes: 12,
    createdAt: "1 saat önce"
  },
  {
    id: 2,
    postId: 1,
    userId: 3,
    user: sampleUsers[2],
    content: "Concurrent features çok heyecan verici görünüyor!",
    likes: 8,
    createdAt: "45 dakika önce"
  },
  {
    id: 3,
    postId: 2,
    userId: 1,
    user: sampleUsers[0],
    content: "Docker konteynerları gerçekten hayat kurtarıcı!",
    likes: 15,
    createdAt: "2 saat önce"
  }
];

// Örnek Mesajlaşmalar
export const sampleConversations = [
  {
    id: 1,
    participants: [1, 2],
    lastMessage: "Toplantı için hazır mısın?",
    lastMessageTime: "10:30",
    unreadCount: 3,
    messages: [
      { id: 1, senderId: 2, content: "Merhaba, nasılsın?", time: "10:15", isOwn: false },
      { id: 2, senderId: 1, content: "İyiyim teşekkürler, sen nasılsın?", time: "10:18", isOwn: true },
      { id: 3, senderId: 2, content: "Toplantı için hazır mısın?", time: "10:30", isOwn: false }
    ]
  },
  {
    id: 2,
    participants: [1, 3],
    lastMessage: "Tasarım dosyalarını gönderdim",
    lastMessageTime: "09:15",
    unreadCount: 0,
    messages: [
      { id: 1, senderId: 3, content: "UI tasarımını tamamladım", time: "09:00", isOwn: false },
      { id: 2, senderId: 1, content: "Harika görünüyor!", time: "09:05", isOwn: true },
      { id: 3, senderId: 3, content: "Tasarım dosyalarını gönderdim", time: "09:15", isOwn: false }
    ]
  }
];

// Örnek Bildirimler
export const sampleNotifications = [
  {
    id: 1,
    type: "like",
    userId: 2,
    user: sampleUsers[1],
    postId: 1,
    content: "gönderinizi beğendi",
    read: false,
    createdAt: "2 dakika önce"
  },
  {
    id: 2,
    type: "comment",
    userId: 3,
    user: sampleUsers[2],
    postId: 1,
    content: "gönderinize yorum yaptı",
    read: false,
    createdAt: "1 saat önce"
  },
  {
    id: 3,
    type: "follow",
    userId: 4,
    user: sampleUsers[3],
    content: "sizi takip etmeye başladı",
    read: true,
    createdAt: "3 saat önce"
  },
  {
    id: 4,
    type: "mention",
    userId: 5,
    user: sampleUsers[4],
    postId: 2,
    content: "bir gönderide sizden bahsetti",
    read: true,
    createdAt: "1 gün önce"
  }
];

// Popüler Konular
export const trendingTopics = [
  { id: 1, name: "React", count: 12456, trend: "up" },
  { id: 2, name: "JavaScript", count: 9876, trend: "up" },
  { id: 3, name: "WebDevelopment", count: 8765, trend: "stable" },
  { id: 4, name: "Startup", count: 6543, trend: "up" },
  { id: 5, name: "AI", count: 5432, trend: "up" },
  { id: 6, name: "Design", count: 4321, trend: "stable" },
  { id: 7, name: "Mobile", count: 3210, trend: "down" },
  { id: 8, name: "Programming", count: 2109, trend: "up" }
];

// Yardımcı Fonksiyonlar
export const getUserById = (id) => {
  return sampleUsers.find(user => user.id === id);
};

export const getPostsByUserId = (userId) => {
  return samplePosts.filter(post => post.userId === userId);
};

export const getPostById = (postId) => {
  return samplePosts.find(post => post.id === postId);
};

export const getCommentsByPostId = (postId) => {
  return sampleComments.filter(comment => comment.postId === postId);
};

export const getConversationBetweenUsers = (userId1, userId2) => {
  return sampleConversations.find(conv => 
    conv.participants.includes(userId1) && conv.participants.includes(userId2)
  );
};

// Rastgele veri üretme
export const generateRandomPost = (userId) => {
  const user = getUserById(userId);
  const randomId = Math.floor(Math.random() * 1000) + 100;
  
  const contents = [
    "Bugün harika bir gün! Yeni bir şeyler öğrendim.",
    "Projemde ilerleme kaydettim, çok mutluyum!",
    "Teknoloji dünyasındaki gelişmeler heyecan verici.",
    "Kod yazmak terapi gibi geliyor bana.",
    "Yeni bir framework öğrenmeye başladım."
  ];
  
  return {
    id: randomId,
    userId: userId,
    user: user,
    content: contents[Math.floor(Math.random() * contents.length)],
    image: Math.random() > 0.5 ? "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : null,
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    createdAt: `${Math.floor(Math.random() * 24)} saat önce`,
    isLiked: false,
    isSaved: false,
    tags: ["react", "javascript", "webdev"]
  };
};
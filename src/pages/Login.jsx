
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        login(data.user);
        navigate("/");
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch (err) {
      setError("Sunucu bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📱 SocialApp</h1>
          <p>Direct Messaging ile sosyal medya deneyimi</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <small>Herhangi bir şifre çalışır</small>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          <div className="demo-info">
            <p><strong>Demo Hesaplar:</strong></p>
            <p>• ahmet@example.com</p>
            <p>• zeynep@example.com</p>
            <p>• mehmet@example.com</p>
            <p>• Veya herhangi bir email</p>
          </div>
        </form>

        <div className="features">
          <h3>Özellikler:</h3>
          <ul>
            <li>✅ Gerçek zamanlı mesajlaşma</li>
            <li>✅ Çevrimiçi durum göstergesi</li>
            <li>✅ Yazıyor bildirimi</li>
            <li>✅ Mesaj okundu bilgisi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
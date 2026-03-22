import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/global.css";

export default function DashboardPage({ navigate, options }) {
  const { user, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(options?.register ? false : true);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
    email: "",
  });

  if (user) {
    navigate("profile");
    return null;
  }

  const handleInput = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name, formData.phone);
      }
      navigate("home");
    } catch (err) {
      setError(isLogin ? 'Incorrect email or password' : 'Registration failed. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ phone: "", password: "", name: "", email: "" });
  };

  return (
    <main className="auth-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0fdf4 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem' 
    }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
        padding: '3rem 2.5rem', 
        maxWidth: '420px', 
        width: '100%' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, var(--grass), var(--grass-l))', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', 
            margin: 0, 
            lineHeight: 1.1 
          }}>
            Harambee
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '0.5rem 0 0' }}>
            {isLogin ? 'Welcome back' : 'Join Harambee'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="name"
                  value={formData.name}
                  onChange={(e) => handleInput('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--grass)'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInput('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--grass)'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
            {isLogin ? 'Email' : 'Phone Number'}
            </label>

            <input
              type={isLogin ? "email" : "tel"}
              placeholder={isLogin ? "name@gmail.com" : "0712 345 678"}
              value={isLogin ? formData.email : formData.phone}
              onChange={(e) => handleInput(isLogin ? 'email' : 'phone', e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--grass)'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInput('password', e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--grass), var(--grass-l))',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 35px -10px rgba(26, 122, 74, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px -5px rgba(26, 122, 74, 0.4)';
            }}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <button
            type="button"
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
            color: 'var(--grass)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            {isLogin ? "Don't have an account? Create one" : 'Have an account? Sign in'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>

        </div>
      </div>
    </main>
  );
}


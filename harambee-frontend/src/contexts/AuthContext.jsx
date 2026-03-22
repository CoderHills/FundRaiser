import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api.js';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiFetch('/auth/me')
        .then((res) => setUser(res.user))
        .catch((err) => {
          localStorage.removeItem('token');
          // If the error is about suspension, show an alert
          if (err.message && err.message.includes('suspended')) {
            alert('Your account has been suspended. Please contact the administrator.');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setIsNewUser(false);
      return res;
    } catch (error) {
      if (error.message && error.message.includes('suspended')) {
        throw new Error('Your account has been suspended. Please contact the administrator.');
      }
      throw error;
    }
  };

  const register = async (email, password, name, phone) => {
    const res = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, phone }) });
    localStorage.setItem('token', res.token);
    setUser(res.user);
    setIsNewUser(true);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsNewUser(false);
  };

  const value = {
    user,
    isNewUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getImageUrl } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('id_gen_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('id_gen_token') || '');
  const [loading, setLoading] = useState(true);

  // Validate existing user token session on app mount
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('id_gen_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data && res.data.success) {
            const userData = res.data.data;
            // Map profileImage path if set
            if (userData.profileImage) {
              userData.avatar = getImageUrl(userData.profileImage);
            }
            setUser(userData);
            localStorage.setItem('id_gen_user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error('[AuthSession Error] Invalid or expired token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      const { token: userToken, user: userData } = res.data.data;
      if (userData.profileImage) {
        userData.avatar = getImageUrl(userData.profileImage);
      }
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('id_gen_token', userToken);
      localStorage.setItem('id_gen_user', JSON.stringify(userData));
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const signup = async (userDataInput) => {
    const res = await api.post('/auth/signup', userDataInput, {
      headers: userDataInput instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    if (res.data && res.data.success) {
      const { token: userToken, user: userData } = res.data.data;
      if (userData.profileImage) {
        userData.avatar = getImageUrl(userData.profileImage);
      }
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('id_gen_token', userToken);
      localStorage.setItem('id_gen_user', JSON.stringify(userData));
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('id_gen_token');
    localStorage.removeItem('id_gen_user');
  };

  const updateUserProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData, {
      headers: profileData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    if (res.data && res.data.success) {
      const updatedUser = res.data.data;
      if (updatedUser.profileImage) {
        updatedUser.avatar = getImageUrl(updatedUser.profileImage);
      }
      setUser((prev) => ({ ...prev, ...updatedUser }));
      localStorage.setItem('id_gen_user', JSON.stringify({ ...user, ...updatedUser }));
      return res.data;
    }
    throw new Error(res.data.message || 'Profile update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!user && !!token,
        login,
        signup,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

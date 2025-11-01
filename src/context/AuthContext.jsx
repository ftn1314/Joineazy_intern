import React, { createContext, useState, useEffect } from 'react';
import seedData from '../data/mockData.json';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);

  useEffect(() => {
    if (token && !user) {
      const savedUser = JSON.parse(localStorage.getItem('auth_user'));
      if (savedUser) setUser(savedUser);
    }
  }, [token]);

  const login = (username, password) => {
    const foundUser = seedData.users.find(
      (u) => u.name.toLowerCase() === username.toLowerCase()
    );
    if (!foundUser) return { success: false, message: 'User not found' };
    if (password !== '12345') return { success: false, message: 'Invalid password' };

    const fakeToken = 'mock-token-' + Date.now();
    setUser(foundUser);
    setToken(fakeToken);
    localStorage.setItem('auth_token', fakeToken);
    localStorage.setItem('auth_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

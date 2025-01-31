import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_HOST } from '@/config/app';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      console.log('Token found:', token);
      const url = `${API_HOST}/api/auth/`;
      console.log('Requesting user info from:', url);

      // Fetch user info if token exists
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('User info retrieved:', response.data);
        setCurrentUser(response.data);
        setIsAuthenticated(true);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        // Optionally handle error, e.g., remove invalid token
        // TODO: uncomment
        // Cookies.remove('token');
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
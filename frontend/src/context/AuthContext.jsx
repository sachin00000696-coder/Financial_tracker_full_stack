import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const SESSION_KEY = 'finora_user';
export function AuthProvider({ children }) {
  const [user,setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  });
  const persist = data => {
    localStorage.setItem('finora_token', data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };
  const signup = async ({name,email,password}) => {
    const {data}=await api.post('/auth/register',{name,email,password});
    return persist(data);
  };
  const login = async ({email,password}) => {
    const {data}=await api.post('/auth/login',{email,password});
    return persist(data);
  };
  const updateProfile = async updates => {
    const {data}=await api.put('/users/profile',{name:updates.name,currency:updates.currency});
    localStorage.setItem(SESSION_KEY,JSON.stringify(data.user)); setUser(data.user); return data.user;
  };
  const logout = () => { localStorage.removeItem('finora_token'); localStorage.removeItem(SESSION_KEY); setUser(null); };
  const value=useMemo(()=>({user,signup,login,logout,updateProfile}),[user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);

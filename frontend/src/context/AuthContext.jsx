import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/shopService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const persist = (u) => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); };
  const save = ({ token, user: u }) => { localStorage.setItem('token', token); persist(u); return u; };

  const login = async (email, password) => save((await loginUser({ email, password })).data);
  const register = async (form) => save((await registerUser(form)).data);
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser: persist }}>
      {children}
    </AuthContext.Provider>
  );
}

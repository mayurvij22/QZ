// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Initialize user if token exists
  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Auto fetch user failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token]);

  // Login user
  const loginUser = async ({ email, password }) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token: tkn, user: usr } = res.data;

      setToken(tkn);
      setUser(usr);
      localStorage.setItem("token", tkn);
      api.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;

      return usr;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // Register user
  const registerUser = async ({ name, email, password }) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password });

      if (res.data?.token && res.data?.user) {
        const { token: tkn, user: usr } = res.data;
        setToken(tkn);
        setUser(usr);
        localStorage.setItem("token", tkn);
        api.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;
        return usr;
      }

      // fallback: auto-login after register if no token returned
      return await loginUser({ email, password });
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, registerUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

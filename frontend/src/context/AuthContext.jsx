import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login: fetch the current user on app load (uses httpOnly cookie)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/profile");
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, remember) => {
    const res = await api.post("/auth/login", { email, password, remember });
    if (res.data.success) {
      setUser(res.data.user);
      if (res.data.token) localStorage.setItem("cpp_token", res.data.token);
      if (remember) {
        localStorage.setItem("remember", "true");
      }
    }
    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/signup", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.success) {
      setUser(res.data.user);
      if (res.data.token) localStorage.setItem("cpp_token", res.data.token);
    }
    return res.data;
  };

  // Auto logout when token expires -> handled by axios interceptor clearing user
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("remember");
    localStorage.removeItem("cpp_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

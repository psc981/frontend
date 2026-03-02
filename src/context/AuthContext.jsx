import { createContext, useState, useEffect } from "react";
import { getProfile, getAdminProfile } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedRole = localStorage.getItem("role") || "user";
  const storedToken =
    storedRole === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(storedToken || "");
  const [role, setRole] = useState(storedRole);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        let res;
        if (role === "admin") {
          res = await getAdminProfile(token);
        } else {
          res = await getProfile(token);
        }
        setUser(res.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, role]);

  const login = (token, role = "user") => {
    setToken(token);
    setRole(role);

    if (role === "admin") {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.setItem("userToken", token);
    }

    localStorage.setItem("role", role);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setRole("user");

    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    sessionStorage.removeItem("announcementShown");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, setUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

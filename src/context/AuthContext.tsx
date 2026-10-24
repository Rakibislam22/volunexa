"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isVolunteer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("volunexa_token");
        const storedUser = localStorage.getItem("volunexa_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Fetch fresh user data from server
          try {
            const res = await api.getMe();
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem("volunexa_user", JSON.stringify(res.user));
            }
          } catch (err) {
            console.error("Token verification failed, clearing auth:", err);
            localStorage.removeItem("volunexa_token");
            localStorage.removeItem("volunexa_user");
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("volunexa_token", res.token);
      localStorage.setItem("volunexa_user", JSON.stringify(res.user));
    }
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("volunexa_token", res.token);
      localStorage.setItem("volunexa_user", JSON.stringify(res.user));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("volunexa_token");
    localStorage.removeItem("volunexa_user");
    window.location.href = "/";
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem("volunexa_user", JSON.stringify(updated));
    }
  };

  const isAuthenticated = !!token && !!user;
  const isOrganizer = user?.role === "organizer";
  const isVolunteer = user?.role === "volunteer";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        isOrganizer,
        isVolunteer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

"use client";

import React from "react";
import { ThemeProvider } from "../../context/ThemeContext";
import { AuthProvider } from "../../context/AuthContext";
import { SocketProvider } from "../../context/SocketContext";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};


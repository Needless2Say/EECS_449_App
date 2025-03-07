"use client";

import React, { createContext, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the shape of your AuthContext value
interface AuthContextType {
  user: any; // Or replace 'any' with a more specific type if you know the user shape
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Optionally define a separate interface for your provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the context, defaulting to `null` initially
// (You'll check for null in consumers or provide a non-null default)
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post("http://localhost:8000/auth.token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Set the default Authorization header for all axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
      localStorage.setItem("token", response.data.access_token);

      setUser(response.data);
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Login Failed: ", error);
    }
  };

  const logout = () => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

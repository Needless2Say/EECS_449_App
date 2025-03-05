"use client";

import React, { useContext, useState, FormEvent } from "react";
import AuthContext from "../context/AuthContext";

const Login: React.FC = () => {
  const auth = useContext(AuthContext);
  // const { login } = useContext(AuthContext);

  // Newly added 3/5/2025
  if (!auth) {
    throw new Error("AuthContext is not available! Did you forget to wrap <AuthProvider>?");
  }
  const { login } = auth;
  // Newly added 3/5/2025

  // Add explicit string type to useState
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Type the event as FormEvent<HTMLFormElement> (or React.FormEvent)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call your AuthContext login function
    login(username, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

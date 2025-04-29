"use client";

import React, { useState } from "react";
import { User } from "../types/form";
import { createUser } from "../api";

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rollNumber.trim() || !name.trim()) {
      setError("Both Roll Number and Name are required.");
      return;
    }

    setIsLoading(true);
    const userData: User = { rollNumber: rollNumber.trim(), name: name.trim() };

    try {
      await createUser(userData);

      console.log("New user created successfully.");
      onLoginSuccess(userData);
    } catch (err) {
      if (err instanceof Error && err.message.includes("User already exists")) {
        console.log("User already exists, proceeding to login.");

        onLoginSuccess(userData);
      } else {
        console.error(
          "Login/Registration failed with an unexpected error:",
          err
        );
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred during registration."
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login / Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="rollNumber">Roll Number:</label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Login / Register"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

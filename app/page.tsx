"use client";

import React, { useState } from "react";

import LoginPage from "./components/LoginPage";
import DynamicForm from "./components/DynamicForm";
import { User } from "./types/form";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  return (
    <main className="app-container">
      {!user ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DynamicForm user={user} />
      )}
    </main>
  );
}

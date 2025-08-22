"use client";

import React, { createContext, useContext, useReducer } from "react";

interface AuthState {
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "LOGIN" }
  | { type: "LOGOUT" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { isAuthenticated: true };
    case "LOGOUT":
      return { isAuthenticated: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(authReducer, {
    isAuthenticated: false,
  });

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

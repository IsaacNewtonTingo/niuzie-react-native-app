import { createContext } from "react";

// Credential context
export const CredentialsContext = createContext({
  storedCredentials: {},
  setStoredCredentials: () => {},
});

export const NotificationContext = createContext({
  notifications: {},
  setNotifications: () => {},
});

export const AuthContext = createContext({
  auth: {},
  setAuth: () => {},
});

export const PendingProductsContext = createContext({
  pendingProducts: {},
  setPendingProducts: () => {},
});

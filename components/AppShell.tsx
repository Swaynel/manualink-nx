"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import Header from "./Header";
import Footer from "./Footer";
import Modals from "./Modals";
import NotificationContainer from "./NotificationContainer";
import { auth } from "../lib/firebase";
import type { ModalType } from "../types/app";

interface AppShellContextValue {
  currentUser: User | null;
  loading: boolean;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error("useAppShell must be used within AppShell.");
  }

  return context;
}

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = useMemo(
    () => ({ currentUser, loading }),
    [currentUser, loading],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <AppShellContext.Provider value={contextValue}>
      <Header currentUser={currentUser} setActiveModal={setActiveModal} />
      {children}
      <Footer />
      <Modals activeModal={activeModal} setActiveModal={setActiveModal} />
      <NotificationContainer />
    </AppShellContext.Provider>
  );
}

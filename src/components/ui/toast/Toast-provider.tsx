"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, type ToastProps } from "./Toast";

type ToastType = Omit<ToastProps, "onClose">;

interface ToastContextType {
  toasts: Array<{ id: string; toast: ToastType }>;
  addToast: (toast: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: string; toast: ToastType }>>([]);

  const addToast = useCallback((toast: ToastType) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, toast }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div 
        className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]"
        aria-live="polite"
        role="region"
      >
        {toasts.map(({ id, toast }) => (
          <Toast
            key={id}
            {...toast}
            onClose={() => removeToast(id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
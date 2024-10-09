'use client'
import React, { createContext, useState, useContext } from 'react';

type ErrorContextType = {
  error: string | null;
  showError: (message: string, ...args: any[]) => void;  // 更新这里
  clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  // 更新 showError 函数
  const showError = (message: string, ...args: any[]) => {
    const formattedMessage = args.length
      ? message.replace(/%[sdjifoO]/g, match => {
          if (args.length === 0) return match;
          const arg = args.shift();
          switch (match) {
            case '%s': return String(arg);
            case '%d': return Number(arg).toString();
            case '%i': return Math.floor(arg).toString();
            case '%f': return parseFloat(arg).toString();
            case '%j': return JSON.stringify(arg);
            case '%o':
            case '%O': return Object.prototype.toString.call(arg);
            default: return match;
          }
        })
      : message;
    setError(formattedMessage);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
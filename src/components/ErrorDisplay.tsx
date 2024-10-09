'use client'
import { useEffect } from 'react';
import { useError } from '@/components/ErrorContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";

export const ErrorDisplay = () => {
  const { error, clearError } = useError();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <Alert variant="destructive" className="fixed top-4 left-0 right-0 z-50 w-1/3 mx-auto bg-slate-300">
      <AlertCircle className="h-4 w-4" />
      <div className="flex justify-between items-center">
        <AlertTitle>Error</AlertTitle>
        <X 
          className="cursor-pointer w-4 h-4"
          onClick={clearError}
        />
      </div>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};
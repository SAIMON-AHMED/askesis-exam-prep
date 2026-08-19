'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export const ASSISTANT_PANEL_WIDTH = 360;

interface AssistantContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

export const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AssistantContext.Provider value={{ isOpen, setIsOpen, toggle: () => setIsOpen((v) => !v) }}>
      {children}
    </AssistantContext.Provider>
  );
};

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    return { isOpen: false, setIsOpen: () => {}, toggle: () => {} };
  }
  return context;
}

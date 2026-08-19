'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useAssistant, ASSISTANT_PANEL_WIDTH } from '@/context/AssistantContext';

export default function AppFrame({ children }: { children: ReactNode }) {
  const { isOpen } = useAssistant();

  return (
    <div
      style={{
        marginRight: isOpen ? `${ASSISTANT_PANEL_WIDTH}px` : 0,
        transition: 'margin-right 250ms ease',
      }}
    >
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
}

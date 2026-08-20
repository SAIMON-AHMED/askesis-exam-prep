'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { useAssistant, ASSISTANT_PANEL_WIDTH } from '@/context/AssistantContext';

export default function AppFrame({ children }: { children: ReactNode }) {
  const { isOpen } = useAssistant();
  const pathname = usePathname();
  // The landing page lays out its own full-bleed bands, so it opts out of the centred container.
  const isFullBleed = pathname === '/';

  return (
    <div
      style={{
        marginRight: isOpen ? `${ASSISTANT_PANEL_WIDTH}px` : 0,
        transition: 'margin-right 250ms ease',
      }}
    >
      <Navbar />
      <main className={isFullBleed ? undefined : 'container'}>{children}</main>
    </div>
  );
}

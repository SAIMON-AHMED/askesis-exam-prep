import confetti from 'canvas-confetti';

/**
 * Triggers a multi-stage celebratory confetti explosion
 */
export function triggerCelebrationConfetti() {
  if (typeof window === 'undefined') return;

  // Initial burst from center
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2563eb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'],
    disableForReducedMotion: true,
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#10b981', '#3b82f6', '#fbbf24', '#a855f7'],
      disableForReducedMotion: true,
    });
  }, 200);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ec4899', '#f59e0b', '#06b6d4', '#10b981'],
      disableForReducedMotion: true,
    });
  }, 400);

  // Star bursts
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      shapes: ['star', 'circle'],
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#3b82f6'],
      disableForReducedMotion: true,
    });
  }, 650);
}

/**
 * Quick mini burst for small milestones or quick adds
 */
export function triggerMiniConfetti() {
  if (typeof window === 'undefined') return;
  confetti({
    particleCount: 35,
    spread: 45,
    origin: { y: 0.65 },
    colors: ['#10b981', '#2563eb', '#f59e0b'],
    disableForReducedMotion: true,
  });
}

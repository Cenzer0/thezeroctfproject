import * as React from 'react';

export function Countdown({ to, onDone, className }: { to: Date | number; onDone?: () => void; className?: string }) {
  const [left, setLeft] = React.useState<number>(() => (typeof to === 'number' ? to : new Date(to).getTime()) - Date.now());

  React.useEffect(() => {
    const id = setInterval(() => {
      const ms = (typeof to === 'number' ? to : new Date(to).getTime()) - Date.now();
      setLeft(ms);
      if (ms <= 0) {
        clearInterval(id);
        onDone?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [to, onDone]);

  const s = Math.max(0, Math.floor(left / 1000));
  const m = Math.floor(s / 60);
  const seconds = s % 60;

  return <span className={className}>{m}:{seconds.toString().padStart(2, '0')}</span>;
}

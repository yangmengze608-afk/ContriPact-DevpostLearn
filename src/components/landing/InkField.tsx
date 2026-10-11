import { useEffect, useRef } from 'react';

export function InkField() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const field = ref.current;
    const host = field?.parentElement;
    if (!field || !host) return;
    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      field.style.setProperty('--ink-x', `${x}%`);
      field.style.setProperty('--ink-y', `${y}%`);
    };
    host.addEventListener('pointermove', move, { passive: true });
    return () => host.removeEventListener('pointermove', move);
  }, []);
  return <div ref={ref} className="ink-field" aria-hidden="true"><i className="ink-ridge ridge-a" /><i className="ink-ridge ridge-b" /></div>;
}

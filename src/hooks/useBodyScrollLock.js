import { useLayoutEffect } from 'react';

let locks = 0;
let restore = null;

// Shared by full-screen experiences, including mobile Safari. Nested locks restore once.
export default function useBodyScrollLock(active) {
  useLayoutEffect(() => {
    if (!active) return;
    if (locks === 0) {
      const body = document.body;
      const root = document.documentElement;
      const x = window.scrollX;
      const y = window.scrollY;
      const properties = ['position', 'top', 'left', 'right', 'width', 'overflow'];
      const previous = properties.map(property => body.style[property]);
      const rootOverflow = root.style.overflow;
      body.style.position = 'fixed';
      body.style.top = `-${y}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      root.style.overflow = 'hidden';
      restore = () => {
        properties.forEach((property, index) => { body.style[property] = previous[index]; });
        root.style.overflow = rootOverflow;
        window.scrollTo({ left: x, top: y, behavior: 'instant' });
      };
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) { restore?.(); restore = null; }
    };
  }, [active]);
}

import { useEffect } from 'react';

/**
 * Custom hook to lock background scrolling when a modal, drawer, or dialog is open.
 * Keeps the background stagnant and stationary while allowing internal modal scrolling.
 */
export function useLockBodyScroll(isOpen = true, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    // Save previous overflow style
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    // Lock scrolling on both body and documentElement
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Handle Escape key to close
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
}

export default useLockBodyScroll;

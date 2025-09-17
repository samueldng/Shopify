import { useState, useEffect } from 'react';

interface UseNewsletterPopupOptions {
  delayMs?: number;
  showOnExit?: boolean;
  showAfterScroll?: number;
  maxShowsPerSession?: number;
  daysBetweenShows?: number;
}

const useNewsletterPopup = (options: UseNewsletterPopupOptions = {}) => {
  const {
    delayMs = 10000, // Show after 10 seconds
    showOnExit = true,
    showAfterScroll = 50, // Show after scrolling 50% of page
    maxShowsPerSession = 1,
    daysBetweenShows = 7
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [hasShownInSession, setHasShownInSession] = useState(false);

  const shouldShowPopup = (): boolean => {
    // Check if user already subscribed
    if (localStorage.getItem('newsletter_subscribed') === 'true') {
      return false;
    }

    // Check if popup was dismissed recently
    const dismissedAt = localStorage.getItem('newsletter_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < daysBetweenShows) {
        return false;
      }
    }

    // Check session limit
    if (hasShownInSession && maxShowsPerSession <= 1) {
      return false;
    }

    return true;
  };

  const showPopup = () => {
    if (shouldShowPopup() && !isOpen) {
      setIsOpen(true);
      setHasShownInSession(true);
    }
  };

  const hidePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!shouldShowPopup()) return;

    // Show after delay
    const delayTimer = setTimeout(() => {
      showPopup();
    }, delayMs);

    // Show after scroll percentage
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= showAfterScroll) {
        showPopup();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Show on exit intent (mouse leaving viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && showOnExit) {
        showPopup();
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(delayTimer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delayMs, showAfterScroll, showOnExit]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        hidePopup();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return {
    isOpen,
    showPopup,
    hidePopup,
    hasShownInSession
  };
};

export default useNewsletterPopup;
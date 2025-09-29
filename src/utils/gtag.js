export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const gaEvent = (action, params = {}) => {
  if (typeof window === 'undefined') return;
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', action, params);
};

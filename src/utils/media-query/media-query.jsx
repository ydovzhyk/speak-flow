'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setScreenType } from '@/redux/technical/technical-slice';

const MediaQuery = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 640px) and (max-width: 1023px)'
    );
    const laptopQuery = window.matchMedia(
      '(min-width: 1024px) and (max-width: 1279px)'
    );
    const desktopQuery = window.matchMedia('(min-width: 1280px)');

    const handleChange = () => {
      if (mobileQuery.matches) dispatch(setScreenType('isMobile'));
      else if (tabletQuery.matches) dispatch(setScreenType('isTablet'));
      else if (laptopQuery.matches) dispatch(setScreenType('isLaptop'));
      else if (desktopQuery.matches) dispatch(setScreenType('isDesktop'));
    };

    handleChange();

    mobileQuery.addEventListener('change', handleChange);
    tabletQuery.addEventListener('change', handleChange);
    laptopQuery.addEventListener('change', handleChange);
    desktopQuery.addEventListener('change', handleChange);

    return () => {
      mobileQuery.removeEventListener('change', handleChange);
      tabletQuery.removeEventListener('change', handleChange);
      laptopQuery.removeEventListener('change', handleChange);
      desktopQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  return null;
};

export default MediaQuery;

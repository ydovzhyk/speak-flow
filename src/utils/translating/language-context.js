'use client';

import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [languageIndex, setLanguageIndex] = useState(0);

  const updateLanguageIndex = index => {
    setLanguageIndex(index);
  };

  return (
    <LanguageContext.Provider value={{ languageIndex, updateLanguageIndex }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

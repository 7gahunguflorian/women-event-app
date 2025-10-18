import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md hover:shadow-lg transition-smooth hover:scale-105"
      aria-label="Toggle language"
    >
      <Languages size={20} />
      <span className="font-medium">{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSwitcher;

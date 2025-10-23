import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { type Language } from '../contexts/LanguageContext';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateAbout, currentLanguage, onLanguageChange }) => {
  const { t } = useLanguage();
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={onNavigateHome} className="flex items-center gap-3 group focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue group-hover:text-blue-900 transition-colors" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 4a1 1 0 00-.526.92V14a1 1 0 00.526.92l7 4a1 1 0 00.788 0l7-4a1 1 0 00.526-.92V6.999a1 1 0 00-.526-.92l-7-4zM10 16.372L4 12.873V8.127l6 3.429v4.816zm0-5.816L4 7.127l6-3.429 6 3.429-6 3.429z" />
          </svg>
          <h1 className="text-2xl font-bold text-brand-blue tracking-wider group-hover:text-blue-900 transition-colors">
            FusionStudies
          </h1>
        </button>
        <nav className="flex items-center gap-4">
          <button onClick={onNavigateAbout} className="text-lg font-semibold text-gray-600 hover:text-brand-blue transition-colors focus:outline-none">
            {t('about')}
          </button>
          <div className="relative">
             <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="appearance-none bg-transparent text-lg font-semibold text-gray-600 hover:text-brand-blue transition-colors focus:outline-none cursor-pointer pr-6"
              aria-label="Select language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
             <svg className="w-4 h-4 absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </nav>
      </div>
    </header>
  );
};
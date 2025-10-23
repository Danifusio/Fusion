import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="text-center bg-white p-8 rounded-xl shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-brand-blue mb-2">{t('heroTitle')}</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        {t('heroSubtitle')}
      </p>
    </div>
  );
};
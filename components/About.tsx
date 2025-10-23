import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-brand-blue mb-6 text-center border-b pb-4">
        {t('aboutTitle')}
      </h2>
      <div className="text-lg text-gray-700 space-y-4 prose max-w-none">
        <p>
          {t('aboutP1_1')} <strong>Fusion</strong>, {t('aboutP1_2')}
        </p>
        <p>
          {t('aboutP2_1')} <strong>{t('aboutP2_2')}</strong> {t('aboutP2_3')}
        </p>
        <p>
          {t('aboutP3')}
        </p>
        <p className="font-semibold text-center text-brand-blue mt-6">
          {t('aboutP4')}
        </p>
      </div>
    </div>
  );
};
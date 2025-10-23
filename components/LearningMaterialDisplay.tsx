
import React from 'react';
import { type LearningMaterial, type Exercise } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface LearningMaterialDisplayProps {
  data: LearningMaterial;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 className="text-xl font-bold text-brand-blue mb-3 border-b-2 border-brand-light pb-2">{title}</h3>
    {children}
  </div>
);

export const LearningMaterialDisplay: React.FC<LearningMaterialDisplayProps> = ({ data }) => {
  const { t } = useLanguage();
  
  const renderExercise = (exercise: Exercise, index: number) => {
    return (
      <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <p className="font-semibold text-gray-700 mb-2">{index + 1}. {exercise.question.replace(/___/g, '______')}</p>
        {exercise.type === 'Multiple-choice' && exercise.options && (
          <div className="flex flex-col space-y-1">
            {exercise.options.map((option, i) => (
              <span key={i} className="text-gray-600 ml-4">{String.fromCharCode(97 + i)}) {option}</span>
            ))}
          </div>
        )}
        <details className="mt-2 text-sm">
            <summary className="cursor-pointer font-medium text-blue-600 hover:underline">{t('showAnswer')}</summary>
            <p className="mt-1 p-2 bg-green-100 text-green-800 rounded">{exercise.answer}</p>
        </details>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InfoCard title={t('summaryTitle')}>
          <p className="text-gray-600">{data.summary}</p>
        </InfoCard>
        <InfoCard title={t('cefrLevelTitle')}>
          <p className="text-2xl font-bold text-brand-red">{data.level}</p>
        </InfoCard>
      </div>
      
      <InfoCard title={t('studyGuideTitle')}>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{data.studyGuide.title}</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {data.studyGuide.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </InfoCard>

      <InfoCard title={t('exercisesTitle')}>
        {data.exercises.map(renderExercise)}
      </InfoCard>

      <InfoCard title={t('practiceTaskTitle')}>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{data.practiceTask.title}</h4>
        <p className="text-gray-600">{data.practiceTask.description}</p>
      </InfoCard>
    </div>
  );
};
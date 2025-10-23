import React, { useState } from 'react';
import { type Exercise } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface QuizDisplayProps {
  quiz: Exercise[];
  onFinish: () => void;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({ quiz, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const { t } = useLanguage();

  const currentQuestion = quiz[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quiz.length;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-blue-50 border-gray-300';
    }
    const isCorrect = option === currentQuestion.answer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) return 'bg-green-200 border-green-400 text-green-900 font-bold';
    if (isSelected && !isCorrect) return 'bg-red-200 border-red-400 text-red-900 font-bold';
    return 'bg-white border-gray-300 opacity-60 cursor-not-allowed';
  };

  if (isQuizFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">{t('quizCompleteTitle')}</h2>
        <p className="text-xl text-gray-700 mb-2">
          {t('yourScore')}: <span className="font-bold text-brand-red text-2xl">{score}</span> / {quiz.length}
        </p>
        <p className="text-3xl font-bold text-brand-blue mb-6">{percentage}%</p>
        <div className="flex justify-center gap-4">
            <button onClick={handleRestart} className="bg-brand-blue hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105">
              {t('restartQuiz')}
            </button>
            <button onClick={onFinish} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105">
              {t('done')}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-brand-blue">{t('interactiveQuizTitle')}</h2>
                <span className="text-sm font-semibold text-gray-600">{t('question')} {currentQuestionIndex + 1} / {quiz.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-brand-red h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}></div>
            </div>
        </div>
        
        <p className="text-lg text-gray-800 font-semibold mb-6 min-h-[3em]">{currentQuestion.question}</p>

        <div className="space-y-4 mb-6">
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 border rounded-lg transition-all text-gray-700 font-medium ${getButtonClass(option)}`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="text-right mt-6 animate-fade-in">
              <button onClick={handleNextQuestion} className="bg-brand-blue hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105">
                {currentQuestionIndex === quiz.length - 1 ? t('finish') : t('nextQuestion')}
              </button>
          </div>
        )}
    </div>
  );
};
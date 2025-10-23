import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FileUpload } from './components/FileUpload';
import { LearningMaterialDisplay } from './components/LearningMaterialDisplay';
import { QuizDisplay } from './components/QuizDisplay';
import { Loader } from './components/Loader';
import { About } from './components/About';
import { generateLearningMaterials, generateQuiz } from './services/geminiService';
import { type LearningMaterial, type Exercise } from './types';
import { useLanguage } from './hooks/useLanguage';

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [learningContent, setLearningContent] = useState<LearningMaterial | null>(null);
  const [quizContent, setQuizContent] = useState<Exercise[] | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);
  const [quizLanguage, setQuizLanguage] = useState<string>('French');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeGenerator, setActiveGenerator] = useState<'materials' | 'quiz' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'hero' | 'materials' | 'quiz' | 'about'>('hero');
  const { t, setLanguage, language } = useLanguage();

  const handleFilesSelect = (files: File[]) => {
    setUploadedFiles(files);
    if (view !== 'hero') {
      handleClearContent();
    }
  };

  const handleClearContent = () => {
    setLearningContent(null);
    setQuizContent(null);
    setError(null);
    setView('hero');
  };

  const handleClearAll = () => {
    setUploadedFiles([]);
    handleClearContent();
  };

  const getImageParts = useCallback(() => {
    return Promise.all(
      uploadedFiles.map(file => {
        return new Promise<{ mimeType: string; data: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            resolve({ mimeType: file.type, data: base64data });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
  }, [uploadedFiles]);

  const handleGenerate = async (type: 'materials' | 'quiz') => {
    if (uploadedFiles.length === 0) {
      setError(t('errorUpload'));
      return;
    }

    setIsLoading(true);
    setActiveGenerator(type);
    setLearningContent(null);
    setQuizContent(null);
    setError(null);
    setView('hero'); // Reset view while loading

    try {
      const imageParts = await getImageParts();

      if (type === 'materials') {
        const result = await generateLearningMaterials(imageParts);
        setLearningContent(result);
        setView('materials');
      } else {
        const result = await generateQuiz(imageParts, numberOfQuestions, quizLanguage);
        setQuizContent(result);
        setView('quiz');
      }
    } catch (err)
 {
      console.error(err);
      setError(t('errorGenerate', { type }));
      setView('hero');
    } finally {
      setIsLoading(false);
      setActiveGenerator(null);
    }
  };
  
  const navigate = (targetView: 'hero' | 'about') => {
    if(isLoading) return;
    
    // If navigating home from a results view, offer a full clear.
    // Otherwise, just change the view.
    if (targetView === 'hero' && (view === 'materials' || view === 'quiz')) {
        handleClearContent();
    } else {
        setView(targetView);
    }
  }


  return (
    <div className="min-h-screen bg-brand-light font-sans text-gray-800">
      <Header 
        onNavigateHome={() => navigate('hero')} 
        onNavigateAbout={() => navigate('about')}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      <main className="container mx-auto px-4 py-8">
        {view === 'about' ? (
          <About />
        ) : (
          <>
            {view === 'hero' && !isLoading && <HeroSection />}

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <FileUpload onFilesSelect={handleFilesSelect} selectedFiles={uploadedFiles} onClear={handleClearAll} />
              {uploadedFiles.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <label htmlFor="question-slider" className="font-semibold text-gray-700 text-center">
                        {t('numberOfQuestions')}: <span className="text-brand-red font-bold">{numberOfQuestions}</span>
                      </label>
                      <input
                        id="question-slider"
                        type="range"
                        min="3"
                        max="15"
                        value={numberOfQuestions}
                        onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                        className="w-56 accent-brand-blue"
                        disabled={isLoading}
                      />
                    </div>
                     <div className="flex flex-col items-center gap-2">
                      <label htmlFor="language-select" className="font-semibold text-gray-700">
                        {t('quizLanguage')}
                      </label>
                      <select
                        id="language-select"
                        value={quizLanguage}
                        onChange={(e) => setQuizLanguage(e.target.value)}
                        className="w-56 p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue disabled:bg-gray-100"
                        disabled={isLoading}
                      >
                        <option value="French">Français</option>
                        <option value="English">English</option>
                        <option value="Spanish">Español</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                      onClick={() => handleGenerate('materials')}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-brand-blue hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                    >
                      {isLoading && activeGenerator === 'materials' ? (<><Loader />{t('generating')}...</>) : t('generateStudyMaterials')}
                    </button>
                    <button
                      onClick={() => handleGenerate('quiz')}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                    >
                      {isLoading && activeGenerator === 'quiz' ? (<><Loader />{t('generating')}...</>) : t('generateInteractiveQuiz')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isLoading && (
                <div className="text-center p-8">
                    <div className="flex justify-center items-center">
                        <Loader />
                        <span className="ml-3 text-gray-700 text-lg">{t('generatingPleaseWait')}...</span>
                    </div>
                </div>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 shadow" role="alert">
                <p className="font-bold">{t('errorTitle')}</p>
                <p>{error}</p>
              </div>
            )}

            {view === 'materials' && learningContent && (
              <div className="mt-8">
                <LearningMaterialDisplay data={learningContent} />
              </div>
            )}

            {view === 'quiz' && quizContent && (
              <div className="mt-8">
                <QuizDisplay quiz={quizContent} onFinish={handleClearContent} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
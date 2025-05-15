import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import QuestionForm from './components/QuestionForm';
import ResultSection from './components/ResultSection';
import AboutSection from './components/AboutSection';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'form' | 'about' | 'results'>('form');

  // Reset results when switching back to form
  useEffect(() => {
    if (activeSection === 'form' && result) {
      setResult(null);
    }
  }, [activeSection, result]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Header setActiveSection={setActiveSection} activeSection={activeSection} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {activeSection === 'form' && (
            <QuestionForm 
              onSubmitSuccess={(data) => {
                setResult(data.result);
                setActiveSection('results');
              }}
              setLoading={setLoading}
            />
          )}
          
          {activeSection === 'results' && result && (
            <ResultSection result={result} onBack={() => setActiveSection('form')} />
          )}
          
          {activeSection === 'about' && (
            <AboutSection />
          )}
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
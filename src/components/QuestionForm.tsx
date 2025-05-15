import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MultiSelect from './MultiSelect';
import { Loader } from 'lucide-react';

interface QuestionFormProps {
  onSubmitSuccess: (data: { result: string }) => void;
  setLoading: (loading: boolean) => void;
}

interface FormData {
  interest: string[];
  strength: string[];
  study: string[];
  motivation: string[];
  vision: string[];
  skills: string[];
  values: string[];
  challenges: string[];
}

interface OptionsData {
  interests: string[];
  strengths: string[];
  study: string[];
  motivation: string[];
  vision: string[];
  skills: string[];
  values: string[];
  challenges: string[];
}

const initialFormData: FormData = {
  interest: [],
  strength: [],
  study: [],
  motivation: [],
  vision: [],
  skills: [],
  values: [],
  challenges: [],
};

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmitSuccess, setLoading }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [options, setOptions] = useState<OptionsData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const response = await axios.get('/api/options');
        setOptions(response.data);
      } catch (err) {
        setError('فشل في تحميل الخيارات. يرجى تحديث الصفحة.');
        console.error('Error fetching options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  const handleChange = (questionKey: keyof FormData, selectedOptions: string[]) => {
    setFormData(prev => ({
      ...prev,
      [questionKey]: selectedOptions
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    const isValid = Object.values(formData).every(value => value.length > 0);
    
    if (!isValid) {
      setError('يرجى الإجابة على جميع الأسئلة قبل الإرسال');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/predict-major', {
        answers: formData
      });
      
      onSubmitSuccess({ result: response.data.result });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('حدث خطأ أثناء تقديم النموذج. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  const steps = [
    {
      title: 'اهتماماتك وقدراتك',
      fields: [
        { key: 'interest', label: 'ما هي المجالات التي تهتم بها؟ (اختر ما تفضله)', options: options?.interests || [] },
        { key: 'strength', label: 'ما هي نقاط قوتك الأكاديمية؟ (اختر ما ينطبق عليك)', options: options?.strengths || [] },
      ],
    },
    {
      title: 'طريقة التعلم والتحفيز',
      fields: [
        { key: 'study', label: 'كيف تفضل الدراسة؟ (اختر ما ينطبق عليك)', options: options?.study || [] },
        { key: 'motivation', label: 'ما الذي يحفزك للنجاح؟ (اختر ما يناسبك)', options: options?.motivation || [] },
      ],
    },
    {
      title: 'المستقبل المهني',
      fields: [
        { key: 'vision', label: 'أين ترى نفسك تعمل في المستقبل؟ (اختر ما تطمح إليه)', options: options?.vision || [] },
        { key: 'skills', label: 'ما هي المهارات التي ترغب في تطويرها؟ (اختر ما يناسبك)', options: options?.skills || [] },
      ],
    },
    {
      title: 'القيم والتحديات',
      fields: [
        { key: 'values', label: 'ما هي القيم المهمة بالنسبة لك في حياتك المهنية؟', options: options?.values || [] },
        { key: 'challenges', label: 'ما نوع التحديات التي تستمتع بمواجهتها؟', options: options?.challenges || [] },
      ],
    },
  ];
  
  const nextStep = () => {
    // Validate current step
    const currentStepFields = steps[currentStep].fields.map(field => field.key) as Array<keyof FormData>;
    const isCurrentStepValid = currentStepFields.every(key => formData[key].length > 0);
    
    if (!isCurrentStepValid) {
      setError('يرجى الإجابة على جميع الأسئلة في هذه الخطوة قبل الاستمرار');
      return;
    }
    
    setError(null);
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => prev - 1);
  };
  
  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader className="animate-spin h-10 w-10 mx-auto text-yellow-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل الاستبيان...</p>
        </div>
      </div>
    );
  }
  
  const currentStepData = steps[currentStep];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          حدد مسارك الجامعي المثالي
        </h2>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                <div 
                  className={`rounded-full h-8 w-8 flex items-center justify-center text-sm mb-1 ${
                    index <= currentStep 
                      ? 'bg-yellow-400 text-black font-bold' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs md:text-sm hidden md:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            {currentStepData.title}
          </h3>
          
          {currentStepData.fields.map(field => (
            <div key={field.key} className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label}
              </label>
              <MultiSelect
                options={field.options}
                selected={formData[field.key as keyof FormData]}
                onChange={(selected) => handleChange(field.key as keyof FormData, selected)}
                placeholder="اختر من القائمة..."
              />
            </div>
          ))}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors duration-300"
              >
                السابق
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg mr-auto transition-colors duration-300"
              >
                التالي
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg mr-auto transition-colors duration-300"
              >
                احصل على توصياتك
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default QuestionForm;
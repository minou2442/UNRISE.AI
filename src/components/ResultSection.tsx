import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Share2, Download, Trophy } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResultSectionProps {
  result: string;
  onBack: () => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({ result, onBack }) => {
  // Split the result into lines and parse the major recommendations
  const lines = result.split('\n').filter(line => line.trim() !== '');

  // Extract major name from a recommendation line
  const extractMajorName = (line: string): string => {
    const match = line.match(/^\d+\.\s*(.+?):/);
    return match ? match[1].trim() : '';
  };

  // Get the explanation part after the major name
  const extractExplanation = (line: string): string => {
    const parts = line.split(':');
    return parts.length > 1 ? parts.slice(1).join(':').trim() : '';
  };

  const majorRecommendations = lines
    .map(line => {
      if (line.match(/^\d+\./)) {
        return {
          major: extractMajorName(line),
          explanation: extractExplanation(line),
        };
      }
      return null;
    })
    .filter(Boolean) as { major: string; explanation: string }[];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  // Share result using Web Share API
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'توصياتي للتخصصات الجامعية',
          text: result,
          url: window.location.href,
        })
        .catch(err => {
          alert('فشل المشاركة: ' + err.message);
        });
    } else {
      alert('المشاركة غير مدعومة في هذا المتصفح');
    }
  };

  // Download result as PDF using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    doc.setFontSize(18);
    doc.text('توصياتي للتخصصات الجامعية', 40, 40);

    doc.setFontSize(14);
    const splitText = doc.splitTextToSize(result, 500);
    doc.text(splitText, 40, 70);

    doc.save('unirise_recommendations.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 transition-colors duration-300">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-500 hover:text-yellow-600 transition-colors duration-300"
          >
            <ChevronRight className="ml-1" size={20} />
            <span>العودة للاستبيان</span>
          </button>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            توصياتك للتخصصات الجامعية
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            بناءً على إجاباتك، هذه أفضل التخصصات المناسبة لك
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {majorRecommendations.map((rec, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-lg border-r-4 ${
                index === 0
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10'
                  : index === 1
                  ? 'border-gray-400 bg-gray-50 dark:bg-gray-700/50'
                  : 'border-gray-300 bg-gray-50 dark:bg-gray-700/30'
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`p-3 rounded-full ${
                    index === 0
                      ? 'bg-yellow-400 text-black'
                      : index === 1
                      ? 'bg-gray-400 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white'
                  } mr-4`}
                >
                  {index === 0 ? (
                    <Trophy size={24} />
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {rec.major}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {rec.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
          >
            <Share2 size={18} className="ml-2" />
            مشاركة النتائج
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors duration-300"
          >
            <Download size={18} className="ml-2" />
            حفظ كملف PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultSection;

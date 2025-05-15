import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Target, Star } from 'lucide-react';

const AboutSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center mb-6">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-3 mb-4 md:mb-0 md:mr-6 inline-flex">
              <GraduationCap size={32} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              حول مشروع UniRise
            </h2>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            مشروع UniRise هو منصة مبتكرة تهدف إلى مساعدة الطلاب الجزائريين في اتخاذ قرارات مدروسة بشأن مستقبلهم الأكاديمي والمهني. تم تطوير هذه المنصة لتقديم توصيات مخصصة للتخصصات الجامعية بناءً على اهتمامات الطلاب ونقاط قوتهم وأهدافهم المهنية.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            نحن نؤمن أن كل طالب فريد من نوعه، ولديه مجموعة فريدة من المهارات والاهتمامات. لذلك، نستخدم خوارزميات متقدمة وتقنيات الذكاء الاصطناعي لتحليل إجابات الطلاب وتقديم توصيات مخصصة تتماشى مع شخصياتهم وتطلعاتهم المستقبلية.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 transition-colors duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            ما الذي يميزنا؟
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 h-10 w-10 flex items-center justify-center ml-4">
                <BookOpen size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  توصيات مخصصة
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  نقدم توصيات مخصصة بناءً على مجموعة شاملة من العوامل، وليس فقط على الدرجات الأكاديمية.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 h-10 w-10 flex items-center justify-center ml-4">
                <Users size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  مجتمع داعم
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  نقدم منصة للطلاب للتواصل مع الآخرين الذين لديهم اهتمامات مماثلة وأهداف مهنية مشتركة.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 h-10 w-10 flex items-center justify-center ml-4">
                <Target size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  رؤية واضحة للمستقبل
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  نساعد الطلاب على فهم المسارات المهنية المحتملة المرتبطة بتخصصاتهم الجامعية.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 h-10 w-10 flex items-center justify-center ml-4">
                <Star size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  جودة المعلومات
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  نحرص على تقديم معلومات دقيقة وحديثة عن التخصصات الجامعية وفرص العمل في الجزائر.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 transition-colors duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            من نحن
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            فريق UniRise يتكون من مجموعة من الخبراء في مجالات التعليم العالي، والإرشاد المهني، وتطوير البرمجيات، والذكاء الاصطناعي. نعمل معًا لتقديم منصة متكاملة تساعد الطلاب على اتخاذ قرارات مستنيرة بشأن مستقبلهم.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            رؤيتنا هي تمكين كل طالب جزائري من اكتشاف إمكاناته الحقيقية واختيار المسار الأكاديمي والمهني الذي يتناسب مع شخصيته وطموحاته. نؤمن أن الاختيار الصحيح للتخصص الجامعي هو الخطوة الأولى نحو مستقبل مهني ناجح ومُرضي.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AboutSection;
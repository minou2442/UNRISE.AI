import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import winston from 'winston';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'app.log' })]
});

// Secure API Key
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  logger.error("OPENROUTER_API_KEY not found in environment variables.");
  process.exit(1);
}

// Arabic to English translation map
const translateMap = {
  // Interests
  "التكنولوجيا": "Technology", "البيولوجيا": "Biology", "الاقتصاد": "Economics",
  "الآداب": "Literature", "الفنون": "Arts", "الرياضيات": "Mathematics", "الكيمياء": "Chemistry",
  "علم النفس": "Psychology", "التواصل": "Communication", "التاريخ": "History", "الجغرافيا": "Geography",
  "الطب": "Medicine", "الهندسة": "Engineering", "الفيزياء": "Physics",

  // Strengths
  "حل المشكلات": "Problem-solving", "الحفظ والتذكر": "Memorization", "الإبداع والابتكار": "Creativity",
  "المنطق والتحليل": "Logic", "البحث العلمي": "Research", "مهارات القيادة": "Leadership skills",
  "التفكير النقدي": "Critical thinking", "التنظيم": "Organization", "التخطيط": "Planning",

  // Study preferences
  "بمفردي": "Alone", "ضمن مجموعة": "In a group", "بمشاريع تطبيقية": "With hands-on projects",
  "بالتعلم عن بعد": "Remote learning", "بالقراءة": "Through reading", "بالاستماع": "Through listening",
  "بالممارسة": "Through practice",

  // Motivation
  "مساعدة الآخرين": "Helping others", "الابتكار والتجديد": "Innovation", "المال والربح": "Money",
  "الهيبة والمكانة": "Prestige", "التأثير المجتمعي": "Social impact", "الاكتشاف": "Discovery",
  "التعلم المستمر": "Continuous learning",

  // Vision
  "في مستشفى": "In a hospital", "في مكتب": "In an office", "في مختبر": "In a lab",
  "في المحكمة": "In court", "في استوديو فني": "In an art studio", "في مؤسسة تعليمية": "In an educational institution",
  "في الميدان": "In the field", "في شركة خاصة": "In a private company", "في أماكن متعددة": "In multiple locations",

  // Skills
  "مهارات التقنية": "Technical skills", "مهارات التواصل": "Communication skills",
  "مهارات التحليل": "Analytical skills", "مهارات الإدارة": "Management skills",
  "مهارات البحث": "Research skills", "مهارات الإبداع": "Creative skills",
  "مهارات العرض والتقديم": "Presentation skills",

  // Values
  "الاستقرار الوظيفي": "Job stability", "المرونة": "Flexibility", "التطور المهني": "Professional growth",
  "التوازن بين العمل والحياة": "Work-life balance", "الاستقلالية": "Autonomy",
  "العمل الجماعي": "Teamwork", "التنوع": "Diversity",

  // Challenges
  "حل المشكلات المعقدة": "Solving complex problems", "العمل مع الناس": "Working with people",
  "الابتكار الإبداعي": "Creative innovation", "التحليل العلمي": "Scientific analysis",
  "إدارة الوقت": "Time management", "التعامل مع الضغط": "Stress management",
  "التعلم المستمر": "Continuous learning"
};

// Reverse translation (not used but ready if needed)
const translateReverseMap = Object.entries(translateMap).reduce((acc, [ar, en]) => {
  acc[en] = ar;
  return acc;
}, {});

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://unrise-ai.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to UniRise API', status: 'operational' });
});

// Get options
app.get('/api/options', (req, res) => {
  try {
    const options = {
      interests: Object.keys(translateMap).filter(x => ["التكنولوجيا", "البيولوجيا", "الاقتصاد", "الآداب", "الفنون", "الرياضيات", "الكيمياء", "علم النفس", "التواصل", "التاريخ", "الجغرافيا", "الطب", "الهندسة", "الفيزياء"].includes(x)),
      strengths: ["حل المشكلات", "الحفظ والتذكر", "الإبداع والابتكار", "المنطق والتحليل", "البحث العلمي", "مهارات القيادة", "التفكير النقدي", "التنظيم", "التخطيط"],
      study: ["بمفردي", "ضمن مجموعة", "بمشاريع تطبيقية", "بالتعلم عن بعد", "بالقراءة", "بالاستماع", "بالممارسة"],
      motivation: ["مساعدة الآخرين", "الابتكار والتجديد", "المال والربح", "الهيبة والمكانة", "التأثير المجتمعي", "الاكتشاف", "التعلم المستمر"],
      vision: ["في مستشفى", "في مكتب", "في مختبر", "في المحكمة", "في استوديو فني", "في مؤسسة تعليمية", "في الميدان", "في شركة خاصة", "في أماكن متعددة"],
      skills: ["مهارات التقنية", "مهارات التواصل", "مهارات التحليل", "مهارات الإدارة", "مهارات البحث", "مهارات الإبداع", "مهارات العرض والتقديم"],
      values: ["الاستقرار الوظيفي", "المرونة", "التطور المهني", "التوازن بين العمل والحياة", "الاستقلالية", "العمل الجماعي", "التنوع"],
      challenges: ["حل المشكلات المعقدة", "العمل مع الناس", "الابتكار الإبداعي", "التحليل العلمي", "إدارة الوقت", "التعامل مع الضغط", "التعلم المستمر"]
    };
    res.json(options);
  } catch (error) {
    logger.error(`Error loading options: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch options" });
  }
});

// Predict major route
app.post('/api/predict-major', async (req, res) => {
  try {
    const answers = req.body?.answers;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: "Missing or invalid 'answers' in request body." });
    }

    const requiredKeys = ['interest', 'strength', 'study', 'motivation', 'vision', 'skills', 'values', 'challenges'];
    const missingKeys = requiredKeys.filter(key => !(key in answers));
    if (missingKeys.length) {
      return res.status(400).json({ error: `Missing keys: ${missingKeys.join(', ')}` });
    }

    const processedAnswers = {};
    for (const [key, value] of Object.entries(answers)) {
      processedAnswers[key] = Array.isArray(value)
        ? value.map(v => translateMap[v] || v).join(', ')
        : (translateMap[value] || value);
    }

    const prompt = `
 كمستشار توجيه مهني متخصص في التعليم العالي و البحث العلمي في الجامعات الجزائرية، حلل هذا الملف الشخصي للطالبالساكن في ولايةجيجل:

- Interests: ${processedAnswers.interest}
- Strengths: ${processedAnswers.strength}
- Study Preference: ${processedAnswers.study}
- Motivation: ${processedAnswers.motivation}
- Future Vision: ${processedAnswers.vision}
- Skills: ${processedAnswers.skills}
- Values: ${processedAnswers.values}
- Challenges: ${processedAnswers.challenges}

بناءً على هذا الملف الشامل، اقترح أفضل 3 تخصصات و افضل مكان يمكن دراسة التخصص فيه و المناسب له في الجزائر.
لكل توصية، قدم:
1. اسم التخصص
2. شرحًا موجزًا (من 2 إلى 3 جمل) لماذا يناسب هذا التخصص ملفه الشخصي وجامعة دراسة التخصص
3.  مهنيين ممكنين في الجزائر لهذا التخصص2

صيغة الرد:
1. [اسم التخصص]: [الشرح]. المسارات المهنية: [المهن].
2. [اسم التخصص]: [الشرح]. المسارات المهنية: [المهن].
3. [اسم التخصص]: [الشرح]. المسارات المهنية: [المهن].

تأكد من أن توصياتك واقعية وتتماشى مع النظام الجامعي الجزائري وسوق العمل.
`;

   // Inside POST /api/predict-major route:

const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
  model: 'anthropic/claude-3-haiku',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  max_tokens: 800
}, {
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://unrise-ai.vercel.app', // or your deployed front-end domain
    'X-Title': 'UniRise'
  }
});


const result = response.data?.choices?.[0]?.message?.content?.trim();
if (!result) throw new Error('No valid response from AIMLAPI');

res.json({
  result,
  model: response.data.model,
  processingTime: response.data.usage ? `${Math.round((response.data.usage.total_tokens / 6) * 100) / 100}s` : 'N/A'
});


  } catch (error) {
    logger.error(`Prediction error: ${error.message}`);
    if (error.response) {
      res.status(error.response.status).json({
        error: `API Error: ${error.response.data.error?.message || 'Unknown error'}`
      });
    } else {
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  logger.info(`UniRise API server running on port ${PORT}`);
});

export default app;

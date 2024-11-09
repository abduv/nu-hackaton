const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { uploadFileToCloud } = require('./storageService');
const { extractTextFromFile } = require('./extractTextFromFile');
const { generateQuestions } = require('./generateQuestions');
// const { generateQuestions } = require('./geminiApi');


const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload-and-generate-questions', upload.single('file'), async (req, res) => {
    try {
        console.log("Запрос получен, файл:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        const filePath = req.file.path;
        const fileMimeType = req.file.mimetype;
        

        if (fileMimeType !== 'application/pdf' && fileMimeType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return res.status(400).json({ error: 'Неподдерживаемый формат файла. Пожалуйста, загрузите PDF или DOCX.' });
        }

        const fileUrl = await uploadFileToCloud(filePath);
        const text = await extractTextFromFile(filePath, fileMimeType);

        // Генерация вопросов
        const questions = await generateQuestions(text);
        console.log("Сгенерированные вопросы:", questions);

        // Отправка данных на фронтенд
        console.log("Сгенерированные вопросы для отправки на фронтенд:", questions.candidates.map(candidate => candidate.content.text));
        console.log("Весь объект вопросов от Gemini API:", JSON.stringify(questions, null, 2));

        res.json({
            message: 'Вопросы успешно сгенерированы',
            fileUrl,
            questions: questions.candidates.map(candidate => candidate.content.parts[0]?.text) // измените путь на основе структуры
        });
        
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error.message);
        res.status(500).json({ error: 'Ошибка при обработке запроса', details: error.message });
    }
});


app.listen(5000, () => console.log('Сервер запущен на порту 5000'));

const express = require('express');
const multer = require('multer');
const { uploadFileToCloud } = require('./storageService');
const { extractTextFromFile } = require('./extractTextFromFile');
const { generateQuestions } = require('./generateQuestions');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload-and-generate-questions', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Загрузка файла в Google Cloud Storage (по желанию)
        const fileUrl = await uploadFileToCloud(filePath);

        // Извлечение текста из файла
        const text = await extractTextFromFile(filePath);

        // Генерация вопросов с помощью Gemini API
        const questions = await generateQuestions(text);

        // Возвращаем клиенту URL файла и вопросы
        res.json({ message: 'Вопросы успешно сгенерированы', fileUrl, questions });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ error: 'Ошибка при обработке запроса' });
    }
});

app.listen(5000, () => console.log('Сервер запущен на порту 5000'));

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { uploadFileToCloud } = require('./storageService');
const { extractTextFromFile } = require('./extractTextFromFile');
const { generateQuestions } = require('./generateQuestions');

const app = express();
app.use(cors()); // Разрешаем CORS для всех маршрутов

const upload = multer({ dest: 'uploads/' });

// Маршрут для загрузки файла и генерации вопросов
app.post('/upload-and-generate-questions', upload.single('file'), async (req, res) => {
    try {
        console.log("Запрос получен, файл:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        const filePath = req.file.path;
        const fileExtension = path.extname(filePath).toLowerCase();

        // Проверка допустимых расширений файлов
        if (fileExtension !== '.pdf' && fileExtension !== '.docx') {
            return res.status(400).json({ error: 'Неподдерживаемый формат файла. Пожалуйста, загрузите PDF или DOCX.' });
        }

        // Загрузка файла в Google Cloud Storage (необязательно)
        const fileUrl = await uploadFileToCloud(filePath);
        console.log("Файл загружен в облако, URL:", fileUrl);

        // Извлечение текста из файла
        const text = await extractTextFromFile(filePath);
        console.log("Извлеченный текст:", text);

        // Генерация вопросов с помощью ИИ
        const questions = await generateQuestions(text);
        console.log("Сгенерированные вопросы:", questions);

        res.json({ message: 'Вопросы успешно сгенерированы', fileUrl, questions });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ error: 'Ошибка при обработке запроса' });
    }
});


app.listen(5000, () => console.log('Сервер запущен на порту 5000'));

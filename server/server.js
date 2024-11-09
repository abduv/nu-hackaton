const express = require('express');
const multer = require('multer');
const { uploadFileToCloud } = require('./storageService');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/test-upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileUrl = await uploadFileToCloud(filePath);
        res.json({ message: 'Файл успешно загружен в Google Cloud Storage', fileUrl });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при загрузке файла' });
    }
});

app.listen(5000, () => console.log('Сервер запущен на порту 5000'));

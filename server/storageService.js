const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Путь к JSON-файлу с ключом учетной записи службы
const storage = new Storage({
    keyFilename: path.join(__dirname, 'config/nu-hackaton-b033a0e95304.json.json')
});

// Имя бакета, в который будет загружен файл
const bucketName = 'nu-hackaton-bakket';

async function uploadFileToCloud(filePath) {
    try {
        const fileName = path.basename(filePath);
        await storage.bucket(bucketName).upload(filePath, {
            destination: fileName, // Имя файла в бакете
        });
        const file = storage.bucket(bucketName).file(fileName);
        return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error) {
        console.error('Ошибка при загрузке файла в Google Cloud Storage:', error);
        throw error;
    }
}

module.exports = { uploadFileToCloud };

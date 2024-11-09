const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Путь к JSON-файлу с ключом учетной записи службы
const storage = new Storage({
    keyFilename: path.join(__dirname, 'config/nu-hackaton-b033a0e95304.json') // Убедитесь, что имя файла правильное
});

// Имя бакета, в который будет загружен файл
const bucketName = 'nu-hackaton-bakket';

async function uploadFileToCloud(filePath) {
    try {
        const fileName = path.basename(filePath);
        await storage.bucket(bucketName).upload(filePath, {
            destination: fileName, // Имя файла в бакете
        });
        console.log(`Файл ${fileName} успешно загружен в бакет ${bucketName}`);
        return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error) {
        if (error.code === 404) {
            console.error('Ошибка: указанный бакет не найден.');
        } else if (error.code === 403) {
            console.error('Ошибка: недостаточно прав для загрузки в бакет.');
        } else {
            console.error('Ошибка при загрузке файла в Google Cloud Storage:', error.message);
        }
        throw error;
    }
}

module.exports = { uploadFileToCloud };

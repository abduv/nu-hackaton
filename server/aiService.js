const fs = require('fs');
const pdfParse = require('pdf-parse');
const { Document, Packer } = require('docx'); // Для работы с docx
const { generateQuestions } = require('./geminiAPI'); // Функция для работы с Gemini API

/**
 * Функция для обработки загруженного файла.
 * @param {string} filePath - Путь к файлу, загруженному на сервер.
 * @returns {Promise<Array>} Массив сгенерированных вопросов.
 */
async function processFile(filePath) {
    try {
        // Извлечение текста из файла (PDF или DOCX)
        const fileContent = await extractTextFromFile(filePath);

        // Вызов функции для генерации вопросов с использованием модели Gemini
        const questions = await generateQuestions(fileContent);

        return questions;
    } catch (error) {
        console.error('Ошибка при обработке файла:', error);
        throw error;
    } finally {
        // Удаляем временный файл после обработки
        fs.unlinkSync(filePath);
    }
}

/**
 * Функция для извлечения текста из файла (поддерживаются PDF и DOCX).
 * @param {string} filePath - Путь к файлу, загруженному на сервер.
 * @returns {Promise<string>} Извлечённый текст.
 */
async function extractTextFromFile(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    if (filePath.endsWith('.pdf')) {
        // Обработка PDF файла
        const data = await pdfParse(dataBuffer);
        return data.text;
    } else if (filePath.endsWith('.docx')) {
        // Обработка DOCX файла
        return await extractTextFromDocx(dataBuffer);
    } else {
        throw new Error('Неподдерживаемый формат файла. Поддерживаются только PDF и DOCX.');
    }
}

/**
 * Функция для извлечения текста из DOCX файла.
 * @param {Buffer} dataBuffer - Буфер данных файла DOCX.
 * @returns {Promise<string>} Извлечённый текст.
 */
async function extractTextFromDocx(dataBuffer) {
    // Здесь вы можете использовать стороннюю библиотеку, например `mammoth`, для извлечения текста из DOCX
    const mammoth = require('mammoth');
    const { value: text } = await mammoth.extractRawText({ buffer: dataBuffer });
    return text;
}

module.exports = { processFile };

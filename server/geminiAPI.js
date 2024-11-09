const axios = require('axios');

// API ключ и URL для Gemini
const GEMINI_API_KEY = 'AIzaSyCBH5oytLGFulRkgWfzQKDUNbJdRKkyeOM';
const GEMINI_API_URL = 'https://api.gemini.com/generate-questions';

/**
 * Функция для генерации вопросов с помощью Gemini API.
 * @param {string} text - Текст для анализа.
 * @returns {Promise<Array>} Массив вопросов с вариантами ответов.
 */
async function generateQuestions(text) {
    try {
        const response = await axios.post(
            GEMINI_API_URL,
            { text },
            { headers: { Authorization: `Bearer ${GEMINI_API_KEY}` } }
        );

        return response.data.questions;
    } catch (error) {
        console.error('Ошибка при вызове Gemini API:', error);
        throw error;
    }
}

module.exports = { generateQuestions };

const axios = require('axios');

// Замените эти значения на ваш фактический URL и ключ API Gemini
const GEMINI_API_URL = 'https://api.gemini.com/generate-questions';
const GEMINI_API_KEY = 'AIzaSyCBH5oytLGFulRkgWfzQKDUNbJdRKkyeOM';

/**
 * Отправляет текст в Gemini API для генерации вопросов
 * @param {string} text - Текст лекции или конспекта
 * @returns {Promise<Array>} Массив вопросов и вариантов ответов
 */
async function generateQuestions(text) {
    try {
        const response = await axios.post(
            GEMINI_API_URL,
            { text }, // Передаем текст в теле запроса
            {
                headers: {
                    Authorization: `Bearer ${GEMINI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Предполагаем, что API возвращает массив вопросов
        return response.data.questions;
    } catch (error) {
        console.error('Ошибка при вызове Gemini API:', error);
        throw error;
    }
}

module.exports = { generateQuestions };

const axios = require('axios');

// Укажите базовый URL и ключ API
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCBH5oytLGFulRkgWfzQKDUNbJdRKkyeOM'.trim();

// Функция для генерации вопросов
async function generateQuestions(text) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{
                            text: `Пожалуйста, прочитай снизу текст: 
${text}

На основе этого текста сгенерируй 25 вопросов с четырьмя вариантами ответа на каждый вопрос. Вопросы должны быть разнообразными по сложности и охватывать различные аспекты текста. 

**Формат ответа:**

Предоставь результат в виде массива JavaScript объектов. Каждый объект должен иметь следующие свойства:

* **question:** Текст вопроса.
* **answers:** Массив из четырех строк, представляющих варианты ответа.
* **correctAnswer:** Индекс правильного ответа в массиве answers (от 0 до 3).

**Пример:**
[
    {
        "question": "Какого цвета небо?",
        "answers": ["Красный", "Синий", "Зеленый", "Фиолетовый"],
        "correctAnswer": 1
    },
    // ... остальные вопросы
]
` }]
            }
                ]
    },
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }
        );
        console.log("Ответ: ",response.data.candidates[0].content)
    return response.data;
} catch (error) {
    console.error('Ошибка при вызове Gemini API:', error.response?.data || error.message);
    throw error;
}
}

module.exports = { generateQuestions };

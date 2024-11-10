const axios = require('axios')

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const GEMINI_API_KEY = 'AIzaSyCLXpZEv--axzKfuK0tfqTs6LMdoqwXU7I'

async function generateQuestions(text) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: ` Пожалуйста, прочитай снизу текст:
                ${text}
                На основе этого текста сгенерируй 25 вопросов с четырьмя вариантами ответа на каждый вопрос. Вопросы должны быть разнообразными по сложности и охватывать различные аспекты текста. Предоставь результат в виде массива JavaScript объектов в формате JSON. Каждый объект должен иметь следующие поля: question - для вопроса, массив answers - для вариантов ответа, correctAnswer - индекс правильного ответа из массива answers. Пример ответа ниже:
                [ 
                    { 
                        "question": "Какого цвета небо?", 
                        "answers": ["Красный", "Синий", "Зеленый", "Фиолетовый"], 
                        "correctAnswer": 1,
                    }, 
                    // ... остальные вопросы 
                ]
                `,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error(
      'Ошибка при вызове Gemini API:',
      error.response?.data || error.message
    )
    throw error
  }
}

module.exports = {generateQuestions}

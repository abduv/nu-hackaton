const express = require('express')
const multer = require('multer')
const cors = require('cors')

const {extractTextFromFile} = require('./extractTextFromFile')
const {generateQuestions} = require('./generateQuestions')

const app = express()
app.use(cors())

const upload = multer({dest: 'uploads/'})

app.post(
  '/upload-and-generate-questions',
  upload.array('files'),
  async (req, res) => {
    try {
      if (!req.files.length) {
        return res.status(400).json({error: 'Файл не загружен'})
      }

      const texts = []

      for (let file of req.files) {
        const filePath = file.path
        const fileMimeType = file.mimetype

        const text = await extractTextFromFile(filePath, fileMimeType)

        texts.push(text)
      }

      const questions = await generateQuestions(texts.join('\nСледующий материал:\n'))

      res.json({
        message: 'Вопросы успешно сгенерированы',
        questions: questions.candidates.map(
          candidate => candidate.content.parts[0]?.text
        ),
      })
    } catch (error) {
      console.error('Ошибка при обработке запроса:', error.message)
      res
        .status(500)
        .json({error: 'Ошибка при обработке запроса', details: error.message})
    }
  }
)

app.listen(5000, () => console.log('Server has been started on 5000 PORT'))

const fs = require('fs').promises
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')

async function extractTextFromFile(filePath, mimeType) {
  try {
    const dataBuffer = await fs.readFile(filePath)

    if (mimeType === 'application/pdf') {
      const data = await pdfParse(dataBuffer)

      return data.text
    }

    if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword'
    ) {
      const {value: text} = await mammoth.extractRawText({buffer: dataBuffer})

      return text
    }
  } catch (error) {
    console.error('Ошибка при извлечении текста из файла:', error);
    throw error
  }
}

module.exports = {extractTextFromFile}

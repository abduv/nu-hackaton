const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(filePath, mimeType) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        // console.log("MIME-тип файла:", mimeType);

        if (mimeType === 'application/pdf') {
            const data = await pdfParse(dataBuffer);
            // console.log("Текст извлечён из PDF");
            return data.text;
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value: text } = await mammoth.extractRawText({ buffer: dataBuffer });
            console.log("Текст извлечён из DOCX");
            return text;
        } else {
            throw new Error(`Неподдерживаемый формат файла с MIME-типом: ${mimeType}`);
        }
    } catch (error) {
        // console.error('Ошибка при извлечении текста из файла:', error);
        throw error;
    }
}

module.exports = { extractTextFromFile };

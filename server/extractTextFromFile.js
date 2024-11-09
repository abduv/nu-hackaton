const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    if (filePath.endsWith('.pdf')) {
        const data = await pdfParse(dataBuffer);
        return data.text;
    } else if (filePath.endsWith('.docx')) {
        const { value: text } = await mammoth.extractRawText({ buffer: dataBuffer });
        return text;
    } else {
        throw new Error('Неподдерживаемый формат файла');
    }
}

module.exports = { extractTextFromFile };

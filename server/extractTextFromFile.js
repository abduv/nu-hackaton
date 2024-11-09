
async function extractTextFromFile(filePath) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        if (filePath.endsWith('.pdf')) {
            const data = await pdfParse(dataBuffer);
            return data.text;
        } else if (filePath.endsWith('.docx')) {
            const { value: text } = await mammoth.extractRawText({ buffer: dataBuffer });
            return text;
        } else {
            throw new Error(`Неподдерживаемый формат файла: ${path.extname(filePath)}. Поддерживаются только PDF и DOCX.`);
        }
    } catch (error) {
        console.error('Ошибка при извлечении текста из файла:', error);
        throw error;
    }
}

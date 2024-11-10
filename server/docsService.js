const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
const keyPath = path.join(__dirname, 'config/nu-hackaton-b033a0e95304.json');

/**
 * Авторизация с использованием ключа учетной записи службы.
 * @returns {google.auth.JWT} JWT клиент для доступа к Google Docs API.
 */
function authorize() {
    const credentials = JSON.parse(fs.readFileSync(keyPath));
    const client = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPES
    );
    return client;
}

/**
 * Функция для получения текста из документа Google Docs.
 * @param {string} documentId - ID документа в Google Docs.
 * @returns {Promise<string>} Извлеченный текст.
 */
async function getTextFromGoogleDoc(documentId) {
    const client = authorize();
    const docs = google.docs({ version: 'v1', auth: client });

    const response = await docs.documents.get({
        documentId: documentId,
    });

    const content = response.data.body.content;
    let text = '';
    content.forEach(element => {
        if (element.paragraph) {
            element.paragraph.elements.forEach(elem => {
                if (elem.textRun) {
                    text += elem.textRun.content;
                }
            });
        }
    });
    return text;
}

module.exports = { getTextFromGoogleDoc };

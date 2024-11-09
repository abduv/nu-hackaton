import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [message, setMessage] = useState('');

    // Обработчик выбора файла
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Функция отправки файла на сервер
    const handleFileUpload = async (event) => {
      
        event.preventDefault();

        if (!selectedFile) {
            alert("Пожалуйста, выберите файл");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/upload-and-generate-questions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        

            // Обработка ответа сервера
            const { message, questions } = response.data; // Извлекаем только сообщение и вопросы
            console.log("Ответ от сервера:", response.data);
            setMessage(message);
            setGeneratedQuestions(questions); // Обновляем список вопросов
        } catch (error) {
            console.error("Ошибка при загрузке файла и генерации вопросов:", error);
            setMessage("Ошибка при загрузке файла или генерации вопросов");
        }
        

    };
    

    return (
        <div>
            <h1>Генератор вопросов</h1>
            <form onSubmit={handleFileUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Загрузить файл и сгенерировать вопросы</button>
            </form>

            {/* Сообщение от сервера */}
            {message && <p>{message}</p>}

            {/* Отображение сгенерированных вопросов */}
            {generatedQuestions.length > 0 && (
                <div>
                    <h3>Сгенерированные вопросы:</h3>
                    <ul>
                        {generatedQuestions.map((question, index) => (
                            <li key={index}>{question}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;

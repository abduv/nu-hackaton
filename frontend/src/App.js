import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [file, setFile] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Обработчик выбора файла
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Обработчик загрузки файла
    const handleFileUpload = async () => {
        if (!file) {
            setError('Пожалуйста, выберите файл');
            return;
        }
        
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post('http://localhost:5000/upload-and-generate-questions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
            });
            setQuestions(response.data.questions);
            setError('');
        } catch (err) {
            setError('Ошибка при загрузке файла и генерации вопросов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Генерация вопросов из лекций</h1>

            <input type="file" onChange={handleFileChange} />
            {file && <p>Выбран файл: {file.name}</p>}

            <button onClick={handleFileUpload} disabled={loading}>
                {loading ? 'Загрузка...' : 'Отправить файл'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {questions.length > 0 && (
                <div>
                    <h2>Сгенерированные вопросы</h2>
                    {questions.map((question, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <p><strong>Вопрос {index + 1}:</strong> {question.question}</p>
                            <ul>
                                {question.options.map((option, i) => (
                                    <li key={i}>{option}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './index.css';

function App() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [textMaterial, setTextMaterial] = useState(""); 
  const [uploadType, setUploadType] = useState("document");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([]);

  // Обработчик для Drag-and-Drop
  const onDrop = (acceptedFiles) => {
    const validTypes = uploadType === "document"
      ? ["application/pdf", "application/msword", "text/plain"]
      : ["image/png", "image/jpeg", "image/gif"];

    const filteredFiles = acceptedFiles.filter((file) =>
      validTypes.includes(file.type)
    );

    if (filteredFiles.length !== acceptedFiles.length) {
      setError("Неверный тип файла. Пожалуйста, загрузите подходящий файл.");
    } else {
      setError(null);
      setFiles(filteredFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: uploadType === "document"
      ? ["application/pdf", "application/msword", "text/plain"]
      : ["image/png", "image/jpeg", "image/gif"]
  });

  const handleSubmit = async () => {
    if (!files.length) {
      alert("Пожалуйста, выберите файл");
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await axios.post('http://localhost:5000/upload-and-generate-questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { message, questions } = response.data;
      setMessage(message);
      setQuestions(questions);
    } catch (error) {
      console.error("Ошибка при загрузке файла и генерации вопросов:", error);
      setMessage("Ошибка при загрузке файла или генерации вопросов");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <header className="bg-indigo-600 text-white p-5 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Генератор Тестов</h1>
        <nav className="space-x-6">
          <a href="#home" className="hover:underline">Главная</a>
          <a href="#about" className="hover:underline">О нас</a>
          <a href="#contact" className="hover:underline">Контакты</a>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-xl font-semibold text-indigo-600 mb-6">Загрузите свой материал</h2>

          <div className="flex justify-center mb-6 space-x-3">
            {["document", "text"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setUploadType(type);
                  setFiles([]);
                  setError(null);
                }}
                className={`px-4 py-2 rounded-md font-medium transition duration-200 
                  ${uploadType === type ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Введите тему и тип вопросов для теста..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 px-3 py-2 border border-indigo-300 rounded-md text-sm resize-none text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 shadow-sm"
          ></textarea>

          {uploadType === "text" && (
            <textarea
              placeholder="Введите текстовый материал..."
              value={textMaterial}
              onChange={(e) => setTextMaterial(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md text-sm resize-none text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          )}

          {uploadType === "document" && (
            <div
              {...getRootProps()}
              className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'bg-indigo-100' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <p className="text-sm text-gray-500">{isDragActive ? "Отпустите файл здесь ..." : "Нажмите или перетащите файл сюда"}</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, TXT</p>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold">Выбранный файл:</h4>
              <ul className="list-disc list-inside text-gray-700">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 mt-6 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-200"
          >
            Сгенерировать тест
          </button>

          {message && <p className="text-green-500 text-sm mt-4">{message}</p>}

          {questions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Сгенерированные вопросы:</h3>
              <ul className="list-disc list-inside">
                {questions.map((question, index) => (
                  <li key={index} className="text-gray-700 mt-1">{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        <p>Автор: Ваше Имя</p>
      </footer>
    </div>
  );
}

export default App;

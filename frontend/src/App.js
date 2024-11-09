import React, { useState } from 'react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [textMaterial, setTextMaterial] = useState(""); 
  const [uploadType, setUploadType] = useState("document");
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const validTypes = uploadType === "document"
        ? ["application/pdf", "application/msword"]
        : ["image/png", "image/jpeg", "image/gif"];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError("Неверный тип файла. Пожалуйста, загрузите подходящий файл.");
        setFile(null); 
      } else {
        setError(null); 
        setFile(selectedFile);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [selectedFile] } });
  };

  const handleSubmit = () => {
    if (!file && uploadType !== "text") {
      setError("Пожалуйста, выберите файл.");
    } else if (!query) {
      setError("Пожалуйста, введите запрос.");
    } else if (!textMaterial && uploadType === "text") {
      setError("Пожалуйста, введите текстовый материал.");
    } else {
      alert(`Тип загрузки: ${uploadType}\nФайл: ${file ? file.name : 'Не выбран'}\nЗапрос: ${query}\nТекстовый материал: ${textMaterial}`);
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

          {/* Переключатель типов загрузки */}
          <div className="flex justify-center mb-6 space-x-3">
            {["document", "text", "image"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setUploadType(type);
                  setFile(null);
                  setError(null);
                }}
                className={`px-4 py-2 rounded-md font-medium transition duration-200 
                  ${uploadType === type ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Поле для запроса */}
          <textarea
            placeholder="Введите тему и тип вопросов для теста..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 px-3 py-2 border border-indigo-300 rounded-md text-sm resize-none text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 shadow-sm"
          ></textarea>

          {/* Поле для текстового материала */}
          {uploadType === "text" && (
            <textarea
              placeholder="Введите текстовый материал..."
              value={textMaterial}
              onChange={(e) => setTextMaterial(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md text-sm resize-none text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          )}

          {/* Поле для загрузки файла для документов */}
          {uploadType === "document" && (
            <div className="flex items-center justify-center w-full mb-4">
              <label htmlFor="doc-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Нажмите, чтобы загрузить</span> или перетащите файл</p>
                  <p className="text-xs text-gray-500">PDF, DOC, TXT</p>
                </div>
                <input 
                  id="doc-file" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

          {/* Поле для загрузки изображений */}
          {uploadType === "image" && (
            <div 
              className="flex items-center justify-center w-full mb-4"
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
            >
              <label htmlFor="image-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Нажмите, чтобы загрузить</span> или перетащите файл</p>
                  <p className="text-xs text-gray-500">PNG, JPG или GIF</p>
                </div>
                <input 
                  id="image-file" 
                  type="file" 
                  className="hidden" 
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

          {/* Ошибка */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Кнопка для отправки */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-200"
          >
            Сгенерировать тест
          </button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        <p> Абду Пидр</p>
      </footer>
    </div>
  );
}

export default App;

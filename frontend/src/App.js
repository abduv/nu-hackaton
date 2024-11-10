import React, {useState} from 'react'
import axios from 'axios'
import {useDropzone} from 'react-dropzone'

import loader from './assets/loader.svg'
import logo from './assets/logo.svg'

const ACCEPT_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function App() {
  const [files, setFiles] = useState([])
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    onDrop: acceptedFiles => setFiles(acceptedFiles),
    multiple: true,
    accept: ACCEPT_FILE_TYPES,
    validator: file => {
      if (!ACCEPT_FILE_TYPES.includes(file.type)) {
        return {
          code: 'file-invalid-type',
          message: 'Тип файла не поддерживается',
        }
      }
    },
  })

  const handleSubmit = async () => {
    if (!files.length) {
      alert('Пожалуйста, выберите файл')
      return
    }
    setLoading(true)

    const formData = new FormData()
    for (let file of files) {
      formData.append('files', file)
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/upload-and-generate-questions',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        }
      )

      const {message, questions} = response.data

      setMessage(message)

      const res = JSON.parse(
        questions[0]
          .trim()
          .slice(3, questions.length - 3)
          .replace(/\n/g, '')
          .replace('json', '')
      )

      setQuestions(res)
    } catch (error) {
      console.error('Ошибка при загрузке файла и генерации вопросов:', error)
      setMessage('Ошибка при загрузке файла или генерации вопросов')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 items-center justify-center">
      <header>
        <img src={logo} className="w-full h-24" />
      </header>

      <div className="w-1/2 p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-xl font-semibold text-indigo-600 mb-6">
          Загрузите свой материал
        </h2>

        <textarea
          placeholder="Введите тему и тип вопросов для теста..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full h-12 px-3 py-2 border border-indigo-300 rounded-md text-sm resize-none text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 shadow-sm"
        ></textarea>

        <div
          {...getRootProps()}
          className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
            isDragActive ? 'bg-indigo-100' : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {isDragActive
                ? 'Отпустите файл здесь ...'
                : 'Нажмите или перетащите файл сюда'}
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC</p>
          </div>
        </div>

        {acceptedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold">Загруженные файлы:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {acceptedFiles.map(file => (
                <li key={file.path}>
                  {file.path} - {file.size} байтов
                </li>
              ))}
            </ul>
          </div>
        )}

        {fileRejections.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold">Отклоненные файлы:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {fileRejections.map(({file, errors}) => (
                <li key={file.path}>
                  {file.path} - {file.size} байтов
                  <ul>
                    {errors.map(e => (
                      <li key={e.code}>{e.message}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading ? (
          <button
            disabled
            className="w-full py-3 mt-6 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-200 flex justify-center"
          >
            <img src={loader} />
            Processing...
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full py-3 mt-6 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-200"
          >
            Сгенерировать текст
          </button>
        )}

        {message && <p className="text-red text-sm mt-4">{message}</p>}

        {questions.length > 0 && (
          <div>
            Вопросы:
            {questions.map((question, index) => (
              <div>
                <p>{question.question}</p>
                <ul>
                  {question.answers.map((answer, index) => (
                    <li>{answer}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

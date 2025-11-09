# DeepKlarity - AI-Powered Quiz Generator

<div align="center">

![DeepKlarity](https://img.shields.io/badge/DeepKlarity-AI%20Quiz%20Generator-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)

**Transform Wikipedia articles into engaging, educational quizzes using AI**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-endpoints) • [Contributing](#contributing)

</div>

## 📖 About

DeepKlarity is an intelligent full-stack web application that leverages Google's Gemini AI to automatically generate comprehensive quizzes from Wikipedia articles. Perfect for students, educators, and lifelong learners who want to test their knowledge on any topic.

## ✨ Features

- 📚 **Wikipedia Article Scraping**: Automatically extracts and cleans content from any Wikipedia article
- 🤖 **AI-Powered Quiz Generation**: Uses Gemini 2.5 Flash to generate 5-10 high-quality multiple-choice questions
- 💾 **Quiz History**: Stores all generated quizzes in a database for later viewing and review
- 🎯 **Interactive Quiz Interface**: Take quizzes with instant feedback and detailed explanations
- 📊 **Key Entities & Topics**: Automatically extracts important entities and related topics from articles
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- ⚡ **Fast Performance**: Optimized backend with FastAPI and efficient AI model selection

## 🛠️ Tech Stack

### Backend
- **Python 3.10+** - Core programming language
- **FastAPI** - High-performance, modern web framework
- **SQLAlchemy** - Powerful ORM for database operations
- **LangChain** - LLM framework for AI integration
- **Google Gemini 2.5 Flash** - Advanced language model for quiz generation
- **BeautifulSoup4** - Web scraping and content extraction
- **SQLite/PostgreSQL** - Database support

### Frontend
- **React 18.2** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios/Fetch** - HTTP client for API communication

## 📁 Project Structure

```
DeepKlarity/
├── backend/
│   ├── venv/                       # Python Virtual Environment
│   ├── database.py                 # SQLAlchemy setup and Quiz model
│   ├── models.py                   # Pydantic Schemas for LLM output
│   ├── scraper.py                  # Wikipedia scraping functions
│   ├── llm_quiz_generator.py       # LangChain setup and quiz generation
│   ├── main.py                     # FastAPI application and endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Environment variables (create this)
│   └── quiz_history.db             # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── QuizDisplay.jsx     # Quiz rendering component
│   │   │   └── Modal.jsx           # Modal component
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── tabs/
│   │   │   ├── GenerateQuizTab.jsx # Quiz generation tab
│   │   │   └── HistoryTab.jsx      # Quiz history tab
│   │   ├── App.jsx                 # Main React component
│   │   └── index.css               # Tailwind CSS styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Installation

### Prerequisites

- **Python 3.10 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+ and npm** - [Download Node.js](https://nodejs.org/)
- **Gemini API Key** - [Get your API key here](https://makersuite.google.com/app/apikey)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Kancharla-Renuka/DeepKlarity.git
cd DeepKlarity
```

### Step 2: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   DATABASE_URL=sqlite:///./quiz_history.db  # Optional, defaults to SQLite
   ```

5. **Run the backend server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Step 3: Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📖 Usage

1. **Start the backend server** (see Backend Setup)
2. **Start the frontend server** (see Frontend Setup)
3. **Open your browser** to `http://localhost:5173`
4. **Enter a Wikipedia URL** in the "Generate Quiz" tab
   - Example: `https://en.wikipedia.org/wiki/Artificial_intelligence`
5. **Click "Generate Quiz"** and wait for the AI to create your quiz
6. **Take the quiz** by selecting answers and clicking "Submit Answers"
7. **View your score** and read explanations for each question
8. **Access quiz history** in the "History" tab to review previous quizzes

## 🔌 API Endpoints

### `POST /generate_quiz`

Generate a quiz from a Wikipedia URL.

**Request:**
```json
{
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence"
}
```

**Response:**
```json
{
  "title": "Quiz: Artificial Intelligence",
  "summary": "Brief summary of the article...",
  "questions": [
    {
      "question": "What is AI?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Option 1",
      "explanation": "Explanation of why this answer is correct"
    }
  ],
  "key_entities": ["Entity 1", "Entity 2"],
  "related_topics": ["Topic 1", "Topic 2"]
}
```

### `GET /history`

Get list of all generated quizzes.

**Response:**
```json
[
  {
    "id": 1,
    "url": "https://en.wikipedia.org/wiki/...",
    "title": "Article Title",
    "date_generated": "2024-01-01T12:00:00"
  }
]
```

### `GET /quiz/{quiz_id}`

Get a specific quiz by ID.

**Response:**
Same as `POST /generate_quiz` response.

## 🗄️ Database Configuration

By default, the application uses SQLite (file-based database). The database file `quiz_history.db` will be created automatically in the backend directory.

### Using PostgreSQL (Optional)

1. Install PostgreSQL and create a database
2. Install psycopg2:
   ```bash
   pip install psycopg2-binary
   ```
3. Update the `DATABASE_URL` in your `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/dbname
   ```

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (defaults to SQLite)
DATABASE_URL=sqlite:///./quiz_history.db
```

## 🐛 Troubleshooting

### Backend Issues

- **Import errors**: Make sure you've activated the virtual environment and installed all dependencies
- **API key errors**: Verify your `GEMINI_API_KEY` is set correctly in the `.env` file
- **Database errors**: Ensure you have write permissions in the backend directory (for SQLite)
- **Model not found errors**: The project uses `gemini-2.5-flash`. Make sure your API key has access to Gemini models

### Frontend Issues

- **CORS errors**: Make sure the backend is running on `http://localhost:8000`
- **API connection errors**: Check that the backend server is running and the API URL in `frontend/src/services/api.js` is correct
- **Build errors**: Make sure all dependencies are installed with `npm install`

## 🧪 Development

### Running Tests

Currently, no tests are included. You can add tests using:
- `pytest` for backend tests
- `vitest` or `jest` for frontend tests

### Building for Production

**Backend:**
```bash
# The backend can be deployed using uvicorn or any ASGI server
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
npm run build
# The built files will be in the `dist` directory
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful language model capabilities
- **LangChain** - For excellent LLM framework
- **FastAPI** - For the amazing web framework
- **Wikipedia** - For the vast knowledge base
- **React Team** - For the incredible UI library
- **Tailwind CSS** - For the utility-first CSS framework

## 📧 Contact

For questions, issues, or suggestions, please open an issue on GitHub.

---

<div align="center">

Made with ❤️ using AI and modern web technologies

⭐ Star this repo if you find it helpful!

</div>

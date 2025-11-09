import React, { useState, useEffect } from 'react';
import { getQuizHistory, getQuiz } from '../services/api';
import QuizDisplay from '../components/QuizDisplay';
import Modal from '../components/Modal';

const HistoryTab = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getQuizHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch quiz history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (quizId) => {
    setLoadingQuiz(true);
    setError('');
    try {
      const quizData = await getQuiz(quizId);
      setSelectedQuiz(quizData);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch quiz details');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz History</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No quiz history found. Generate your first quiz to see it here!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quiz.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quiz.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <a
                        href={quiz.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate block max-w-md"
                      >
                        {quiz.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(quiz.date_generated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(quiz.id)}
                        disabled={loadingQuiz}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingQuiz ? 'Loading...' : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuiz(null);
        }}
        title={selectedQuiz?.title || 'Quiz Details'}
      >
        {selectedQuiz ? (
          <QuizDisplay quizData={selectedQuiz} />
        ) : (
          <div className="text-center py-8 text-gray-500">Loading quiz...</div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryTab;




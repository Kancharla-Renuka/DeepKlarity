import React, { useState } from 'react';

const QuizDisplay = ({ quizData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!quizData) {
    return <div className="text-center text-gray-500">No quiz data available</div>;
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-2">{quizData.title}</h2>
        <p className="text-blue-100">{quizData.summary}</p>
      </div>

      {/* Key Entities and Related Topics */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Key Entities</h3>
          <div className="flex flex-wrap gap-2">
            {quizData.key_entities.map((entity, index) => (
              <span
                key={index}
                className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {quizData.related_topics.map((topic, index) => (
              <span
                key={index}
                className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quizData.questions.map((question, qIndex) => {
          const isCorrect = selectedAnswers[qIndex] === question.correct_answer;
          const showExplanation = showResults && selectedAnswers[qIndex];

          return (
            <div
              key={qIndex}
              className={`bg-white border-2 rounded-lg p-6 ${
                showResults
                  ? isCorrect
                    ? 'border-green-500'
                    : selectedAnswers[qIndex]
                    ? 'border-red-500'
                    : 'border-gray-200'
                  : 'border-gray-200'
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {qIndex + 1}. {question.question}
              </h3>
              <div className="space-y-2">
                {question.options.map((option, oIndex) => {
                  const isSelected = selectedAnswers[qIndex] === option;
                  const isCorrectOption = option === question.correct_answer;

                  return (
                    <label
                      key={oIndex}
                      className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                        showResults
                          ? isCorrectOption
                            ? 'bg-green-100 border-green-500'
                            : isSelected && !isCorrectOption
                            ? 'bg-red-100 border-red-500'
                            : 'bg-gray-50 border-gray-200'
                          : isSelected
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(qIndex, option)}
                        disabled={showResults}
                        className="mr-3"
                      />
                      <span className="flex-1">{option}</span>
                      {showResults && isCorrectOption && (
                        <span className="text-green-600 font-bold">✓ Correct</span>
                      )}
                      {showResults && isSelected && !isCorrectOption && (
                        <span className="text-red-600 font-bold">✗ Wrong</span>
                      )}
                    </label>
                  );
                })}
              </div>
              {showExplanation && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50' : 'bg-yellow-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-700">
                    Explanation:
                  </p>
                  <p className="text-sm text-gray-600">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== quizData.questions.length}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answers
          </button>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-800">
                Score: {calculateScore()} / {quizData.questions.length}
              </h3>
              <p className="text-blue-600 mt-2">
                {Math.round((calculateScore() / quizData.questions.length) * 100)}% Correct
              </p>
            </div>
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDisplay;




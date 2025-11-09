const API_BASE_URL = 'http://localhost:8000';

/**
 * Generate a quiz from a Wikipedia URL
 * @param {string} url - Wikipedia URL
 * @returns {Promise<Object>} Quiz data
 */
export async function generateQuiz(url) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate quiz');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to generate quiz');
  }
}

/**
 * Get quiz history
 * @returns {Promise<Array>} List of quiz history items
 */
export async function getQuizHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch history');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch history');
  }
}

/**
 * Get a specific quiz by ID
 * @param {number} quizId - Quiz ID
 * @returns {Promise<Object>} Quiz data
 */
export async function getQuiz(quizId) {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch quiz');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch quiz');
  }
}




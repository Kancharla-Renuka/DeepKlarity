import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from models import QuizOutput
import json

# Load environment variables
load_dotenv()


def get_llm_chain():
    """
    Setup and return the LLM chain for quiz generation.
    """
    # Get API key from environment
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    
    # Initialize Gemini model
    # Using gemini-2.5-flash which is available and fast for quiz generation
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.7,
    )
    
    # Create prompt template
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are an expert quiz generator. Your task is to create an engaging and educational quiz based on Wikipedia article content.

Generate a quiz that:
1. Has 5-10 questions (preferably 7-8 questions)
2. Covers key concepts, facts, and important information from the article
3. Includes 4 multiple-choice options for each question
4. Provides clear explanations for correct answers
5. Identifies key entities (people, places, concepts, etc.)
6. Lists related topics

Make sure the questions are:
- Clear and unambiguous
- Educational and informative
- Cover different aspects of the article
- Range from basic to moderate difficulty
- Not too obscure or trivial

Return the response in the following JSON format:
{{
    "title": "Quiz title based on the article",
    "summary": "Brief 2-3 sentence summary of the article",
    "questions": [
        {{
            "question": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct_answer": "Option 1",
            "explanation": "Explanation of why this answer is correct"
        }}
    ],
    "key_entities": ["Entity 1", "Entity 2", ...],
    "related_topics": ["Topic 1", "Topic 2", ...]
}}"""),
        ("human", """Generate a quiz based on the following Wikipedia article content:

{article_text}

Remember to:
- Create 5-10 well-structured questions
- Ensure all questions have exactly 4 options
- Make sure the correct_answer matches one of the options exactly
- Provide meaningful explanations
- Extract key entities and related topics""")
    ])
    
    # Create JSON parser with Pydantic model
    parser = JsonOutputParser(pydantic_object=QuizOutput)
    
    # Create chain
    chain = prompt_template | llm | parser
    
    return chain


def generate_quiz(article_text: str) -> QuizOutput:
    """
    Generate a quiz from article text using the LLM.
    
    Args:
        article_text: Clean text content from Wikipedia article
        
    Returns:
        QuizOutput object with generated quiz data
    """
    try:
        chain = get_llm_chain()
        
        # Invoke the chain
        result = chain.invoke({"article_text": article_text})
        
        # Validate result is QuizOutput
        if isinstance(result, dict):
            result = QuizOutput(**result)
        
        return result
        
    except OutputParserException as e:
        raise ValueError(f"Failed to parse LLM output: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error generating quiz: {str(e)}")


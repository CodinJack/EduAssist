import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load API key from .env file
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # Set up Gemini API

def generate_questions(topic, num_questions, difficulty):
    model = genai.GenerativeModel("gemini-2.0-flash")  # Use Gemini API

    prompt = f"""
    Generate {num_questions} multiple-choice quiz questions on {topic} with 2-3 tags each and difficulty {difficulty} (where Beginner is the easiest, Intermediate being medium-level and Advanced being hard questions) and the options should be like "a" : "x", "b" : "y", "c" : "z", "d" : "s".
    Each question should be in JSON format like this:
    
    {{
        "question": "What is the capital of France?",
        "options": {{"a": "Berlin", "b": "Madrid", "c": "Paris", "d": "Lisbon"}},
        "difficulty" : "Beginner",
        "tags": ["geography", "capital cities"],
        "correct_answer": "c",
        "attempted_option": ""
    }}
    """

    response = model.generate_content(prompt)
    return response.text

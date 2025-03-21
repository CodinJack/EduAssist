import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
from django.http import JsonResponse
from backend.settings import db

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
        "attempted_option": "",
<<<<<<< HEAD
        "hint" :"It is popular for having the Eiffel Tower",
        "solution" : "Paris is the answer, and blah blah its a popular place famous for it croissants and Eiffel Tower"
=======
        "hints" : "Famous for Eiffel Tower",
        "solution" : "Paris is the capital of France and famous for Eiffel Tower and croissants."
>>>>>>> 3b89cd29070a18e369c6e33ad8e0e1f73716c97f
    }}
    """

    response = model.generate_content(prompt)
    return response.text

def store_test_results(user_id, test_id, weak_tags, score):
    """
    Stores test results in Firebase Firestore.
    """
    doc_ref = db.collection("users").document(user_id).collection("tests").document(test_id)
    doc_ref.set({
        "weak_tags": weak_tags,
        "score": score,
        "timestamp": datetime.utcnow()
    }, merge=True)
    return f"Test {test_id} stored for user {user_id}"

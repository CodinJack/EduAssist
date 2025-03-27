import google.generativeai as genai
from dotenv import load_dotenv
import os
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_questions(topic):
    model = genai.GenerativeModel("gemini-2.0-flash")  # Use Gemini API
    prompt = f"""
    If the given topic '{topic}' is NSFW, or is some sensitive topic or something you don't understand or something not safe for children to know, just dont give anything - give an empty json list.
    But if '{topic}' is a normal topic then generate 20 multiple-choice questions on the topic "{topic}" with three difficulty levels:
    - First 12 should be beginner-level
    - Next 8 should be intermediate-level
    - Last 5 should be advanced-level
    
    Each question should be in JSON format like this:
    
    {{
        "question": "What is the capital of France?",
        "options": {{"a": "Berlin", "b": "Madrid", "c": "Paris", "d": "Lisbon"}},
        "difficulty" : "Beginner",
        "tags": ["geography", "capital cities"],
        "correct_answer": "c",
        "attempted_option": "",
        "hints" : "Famous for Eiffel Tower",
        "solution" : "Paris is the capital of France and famous for Eiffel Tower and croissants."
    }}
    
    Return the result as a JSON array, without any markdown formatting.
    """
    response = model.generate_content(prompt)
    return response.text


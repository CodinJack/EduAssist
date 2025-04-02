import google.generativeai as genai
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY"),
    transport="requests",
)

# Set proxy
proxies = {
    "http": "http://172.31.2.4:8080",
    "https": "http://172.31.2.4:8080",
}

# Test if the proxy works
session = requests.Session()
session.proxies.update(proxies)



def generate_questions(topic):
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"""
    If the given topic '{topic}' is NSFW, or is some sensitive topic or something you don't understand or something not safe for children to know, just dont give anything - give an empty json list.
    But if '{topic}' is a normal topic then generate 20 multiple-choice questions on the topic "{topic}" with three difficulty levels:
    - First 12 should be beginner-level
    - Next 8 should be intermediate-level
    - Last 5 should be advanced-level
    
    Each question should be in JSON format like this:
    
    {{"question": "What is the capital of France?",
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
    start_time = time.time()  # Track execution time
    print("🚀 Sending request to Gemini API...")

    response = model.generate_content(prompt, stream=True)  # Enable streaming  
    text = ""  
    for chunk in response:  
        text += chunk.text  
    
    end_time = time.time()
    print(f"✅ Received response in {end_time - start_time:.2f} seconds")

    return text

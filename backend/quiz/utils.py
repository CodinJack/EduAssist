import google.generativeai as genai
import requests
import os
import time
import socket
import json
from dotenv import load_dotenv
load_dotenv()

os.environ["GEMINI_API_KEY"] = "AIzaSyDAnYOh-aVGs1pdkrcq_djJqZCWySdwiKo"
def is_proxy_needed():
    """Check if we're likely in the hostel network that needs a proxy"""
    # First check if the user explicitly wants to use a proxy via flag file
    if os.path.exists("use_proxy.flag"):
        return True
        
    try:
        # Try to get hostname and IP address
        hostname = socket.gethostname()
        ip = socket.gethostbyname(hostname)
        
        # Check if we're in a specific network that requires proxy
        return ip.startswith("172.31.")
    except Exception as e:
        print(f"Error detecting network: {e}")
        # If any error occurs, default to no proxy
        return False

def configure_api(force_proxy=None):
    """
    Configure the Gemini API with or without proxy based on the network
    
    Args:
        force_proxy: Override automatic detection. 
                    True to force using proxy, 
                    False to force not using proxy,
                    None to use automatic detection
    """
    # Always configure with the API key
    api_config = {
        "api_key": os.getenv("GEMINI_API_KEY"),
        "transport": "rest",
    }
    
    # Determine if proxy is needed
    use_proxy = force_proxy if force_proxy is not None else is_proxy_needed()
    
    if use_proxy:
        print("Configuring with proxy")
        # Set proxy for environment
        os.environ["HTTP_PROXY"] = "http://172.31.2.4:8080"
        os.environ["HTTPS_PROXY"] = "http://172.31.2.4:8080"
    else:
        print("Configuring without proxy")
        # Clear any proxy settings that might be lingering
        if "HTTP_PROXY" in os.environ:
            del os.environ["HTTP_PROXY"]
        if "HTTPS_PROXY" in os.environ:
            del os.environ["HTTPS_PROXY"]
    
    # Configure the API
    genai.configure(**api_config)

def extract_json_from_response(text):
    """Extract valid JSON from the API response, handling different formats"""
    # Try to parse directly first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # Try to extract JSON from markdown code blocks
    try:
        match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
        if match:
            return json.loads(match.group(1).strip())
    except (json.JSONDecodeError, AttributeError, IndexError):
        pass
    
    # Try to find JSON array in the text
    try:
        match = re.search(r'(\[\s*\{.*\}\s*\])', text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
    except (json.JSONDecodeError, AttributeError, IndexError):
        pass
    
    # If all else fails, return empty list
    print("Could not extract valid JSON from response")
    return []

def generate_questions(topic, numQuestions, difficulty):
    prompt = f"""
    Generate {numQuestions} multiple-choice quiz questions on {topic} with 2-3 tags each and difficulty {difficulty} (where Beginner is the easiest, Intermediate being medium-level and Advanced being hard questions) and the options should be like "a" : "x", "b" : "y", "c" : "z", "d" : "s".
    If the given topic '{topic}' is NSFW, or is some sensitive topic that kids shouldnt learn about or its something you dont understand, , just dont give anything - give an empty json list.
    But if '{topic}' is a normal topic then generate questions.
    Don't keep the tags of different questions too different please, like some question tags can overlap of multiple questions.
    Remember I need {numQuestions} questions!!!!
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
    """
    
    # Strategy:
    # 1. Try with automatic proxy detection
    # 2. If that fails, try with forced proxy
    # 3. If that fails, try without proxy
    
    strategies = [
        {"name": "Auto detection", "force_proxy": None},
        {"name": "With proxy", "force_proxy": True},
        {"name": "Without proxy", "force_proxy": False}
    ]
    
    for strategy in strategies:        
        try:
            # Configure API with the current strategy
            configure_api(force_proxy=strategy["force_proxy"])
            
            # Create model and generate content
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt, stream=True)
            
            # Combine streamed response chunks
            text = ""
            for chunk in response:
                text += chunk.text
                        
            # Process and return the response
            if text:
                # Try to parse it as JSON and make sure we have an array
                try:
                    # For backward compatibility, try the markdown extraction first
                    import re
                    match = re.search(r'```json([\s\S]*?)```', text)
                    if match:
                        json_data = json.loads(match.group(1).strip())
                        if isinstance(json_data, list):
                            return text
                    
                    # If not markdown, try direct JSON parsing
                    json_data = json.loads(text)
                    if isinstance(json_data, list):
                        return json.dumps(json_data)
                    
                    # If we got here but it's not a list, return the raw text
                    # so the view function can handle extraction
                    return text
                except:
                    # Just return the raw text if parsing fails
                    return text
            
        except Exception as e:
            print(f"Error with {strategy['name']} strategy: {e}")
    
    # If all strategies failed
    print("All connection strategies failed")
    return ""

# Import re here to ensure it's available
import re
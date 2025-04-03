import google.generativeai as genai
import requests
import os
import time
import socket
from dotenv import load_dotenv

load_dotenv()

def is_proxy_needed():
    """Check if we're likely in the hostel network that needs a proxy"""
    # You can customize this check based on your network environment
    # For example, check the local IP address pattern or try to connect to a known host
    try:
        # Try to get hostname - this might help identify the network
        hostname = socket.gethostname()
        
        # Or check IP address pattern
        ip = socket.gethostbyname(hostname)
        if os.path.exists("use_proxy.flag"):
            return True
            
        # For demo, just check if we're in a specific network
        return ip.startswith("172.31.")
    except:
        # If any error occurs, default to no proxy
        return False

def configure_api():
    """Configure the Gemini API with or without proxy based on the network"""
    # Always configure with the API key
    api_config = {
        "api_key": os.getenv("GEMINI_API_KEY"),
        "transport": "rest",
    }
    
    # Check if we need to use proxy
    if is_proxy_needed():
        print("Detected hostel network - configuring with proxy")
        # Set proxy for environment
        os.environ["HTTP_PROXY"] = "http://172.31.2.4:8080"
        os.environ["HTTPS_PROXY"] = "http://172.31.2.4:8080"
    else:
        print("No proxy needed - clearing proxy settings")
        # Clear any proxy settings that might be lingering
        if "HTTP_PROXY" in os.environ:
            del os.environ["HTTP_PROXY"]
        if "HTTPS_PROXY" in os.environ:
            del os.environ["HTTPS_PROXY"]
    
    # Configure the API
    genai.configure(**api_config)

def generate_questions(topic):
    # Make sure API is configured correctly for current network
    configure_api()
    
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

    try:
        response = model.generate_content(prompt, stream=True)  # Enable streaming  
        text = ""  
        for chunk in response:  
            text += chunk.text  
        
        end_time = time.time()
        print(f"✅ Received response in {end_time - start_time:.2f} seconds")
        return text
    except Exception as e:
        print(f"Error generating content: {e}")
        # If error occurs and might be proxy-related, try the other configuration
        if "proxy" in str(e).lower() or "connection" in str(e).lower():
            print("Connection error detected. Trying with alternate proxy settings...")
            # Toggle proxy setting and try again
            if "HTTP_PROXY" in os.environ:
                del os.environ["HTTP_PROXY"]
                del os.environ["HTTPS_PROXY"]
                print("Retrying without proxy...")
            else:
                os.environ["HTTP_PROXY"] = "http://172.31.2.4:8080"
                os.environ["HTTPS_PROXY"] = "http://172.31.2.4:8080"
                print("Retrying with proxy...")
            
            try:
                response = model.generate_content(prompt, stream=True)
                text = ""
                for chunk in response:  
                    text += chunk.text  
                return text
            except Exception as retry_error:
                print(f"Retry also failed: {retry_error}")
        return ""
    


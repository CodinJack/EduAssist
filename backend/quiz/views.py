import json
from firebase_admin import auth, credentials, firestore
from .utils import generate_questions
import re
<<<<<<< HEAD
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
from .models import UserStreak
from datetime import timedelta
from .models import UserStreak
from django.contrib.auth.models import User
=======
import traceback
from django.views.decorators.csrf import csrf_exempt
from backend.settings import db
from django.http import JsonResponse
from google.cloud import firestore
 
def extract_json_from_markdown(markdown_text):
    # Extract JSON block inside triple backticks
    match = re.search(r'```json([\s\S]*?)```', markdown_text)

    if not match:
        raise ValueError("No JSON block found in Markdown.")

    try:
        json_data = json.loads(match.group(1).strip())  # Convert JSON string to Python dict
        return json_data
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON format.")


@csrf_exempt
def create_quiz(request):
    """Create a new quiz with questions generated by AI"""
    print("Quiz creation endpoint called")
    
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is supported"}, status=405)
    
    try:
        request_body = request.body.decode('utf-8')
        print(f"Raw request body: {request_body[:200]}")  # Debug first 200 chars
        
        if not request_body.strip():
            return JsonResponse({"error": "Empty request body"}, status=400)
        
        # Parse JSON data
        try:
            data = json.loads(request_body)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            return JsonResponse({"error": f"Invalid JSON in request: {str(e)}"}, status=400)
        
        print(f"Parsed request data: {data}")
        
        # Extract required fields
        topic = data.get("topic")
        numQuestions = data.get("numQuestions")
        difficulty = data.get("difficulty")
        timeLimit = data.get("timeLimit")
        userId = data.get("userId")
        
        # Validate required fields
        if not all([topic, numQuestions, difficulty, timeLimit, userId]):
            return JsonResponse({"error": "All fields (topic, numQuestions, difficulty, timeLimit, userId) are required"}, status=400)
        
        # Generate questions
        questions = generate_questions(topic, numQuestions, difficulty)
        
        # Validate questions
        if not questions:
            return JsonResponse({"error": "Failed to generate quiz questions"}, status=500)
        if len(questions) == 0:
            return JsonResponse({"error": "Cannot create practice questions!"}, status=500)

        questions = extract_json_from_markdown(questions) 

        # Return the generated questions to the frontend
        quiz_data = {
            "userId": userId,
            "topic": topic,
            "numQuestions": numQuestions,
            "difficulty": difficulty,
            "timeLimit": timeLimit,
            "questions": questions
        }
        
        return JsonResponse({
            "data": quiz_data,
            "message": "Quiz questions generated successfully"
        }, status=200)
            
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

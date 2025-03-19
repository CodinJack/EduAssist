from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from firebase_config import db
from .utils import generate_questions

@csrf_exempt
def create_quiz(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            topic = data.get("topic")
            num_questions = data.get("num_questions")
            difficulty = data.get("difficulty")

            if not topic or not num_questions or not difficulty:
                return JsonResponse({"error": "Topic, number of questions, and difficulty are required"}, status=400)

            # Generate questions using Gemini API
            questions_json = generate_questions(topic, num_questions, difficulty)
            print(f"Generated Questions: {questions_json}")  # Debugging
            cleaned_json = questions_json.strip("```json").strip("```")

            try:
                questions_data = json.loads(cleaned_json)  # Convert string to JSON
            except json.JSONDecodeError:
                print("ERROR: Invalid JSON format received from Gemini API")  # Debugging
                return JsonResponse({"error": "Invalid JSON format received from Gemini API"}, status=500)

            # Store quiz in Firestore
            quiz_data = {
                "topic": topic,
                "num_questions": num_questions,
                "difficulty": difficulty,
                "questions": questions_data
            }
            doc_ref = db.collection("quizzes").add(quiz_data)

            return JsonResponse({"id": doc_ref[1].id, "message": "Quiz created successfully"}, status=201)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

def get_all_quizzes(request):
    try:
        quizzes_ref = db.collection("quizzes").get()
        quizzes = [{"id": doc.id, **doc.to_dict()} for doc in quizzes_ref]
        return JsonResponse(quizzes, safe=False, status=200)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_quiz(request, quiz_id):
    try:
        doc = db.collection("quizzes").document(quiz_id).get()
        if not doc.exists:
            return JsonResponse({"error": "Quiz not found"}, status=404)
        return JsonResponse({"id": doc.id, **doc.to_dict()}, status=200)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from firebase_config import db
from .utils import generate_questions, store_test_results
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
<<<<<<< HEAD

=======
>>>>>>> 3b89cd29070a18e369c6e33ad8e0e1f73716c97f
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
            cleaned_json = questions_json.strip("json").strip("")

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


def submit_quiz(request, quiz_id):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    data = json.loads(request.body)  # Get attempted answers from request
    user_id = data.get("user_id")  # Assuming user_id is sent in the request

    # Fetch quiz details from Firestore
    quiz_ref = db.collection("quizzes").document(quiz_id)
    quiz_doc = quiz_ref.get()

    if not quiz_doc.exists:
        return JsonResponse({"error": "Quiz not found"}, status=404)

    quiz_data = quiz_doc.to_dict()
    questions = quiz_data.get("questions", [])

    # Track wrong answers per tag
    tag_wrong_count = {}

    for question in questions:
        question_id = str(question["id"])
        selected_option = data.get(question_id)  # User's selected option

        # Check if the selected option is correct
        if selected_option and selected_option != question["correct_option"]:
            for tag in question["tags"]:  # Tags are stored as a list
                tag_wrong_count[tag] = tag_wrong_count.get(tag, 0) + 1

    # Threshold for weak topics
    threshold = 3
    weak_tags = [tag for tag, count in tag_wrong_count.items() if count >= threshold]

    # Store weak topics in Firestore if any exist
    if weak_tags:
        weaklist_ref = db.collection("weaklist").document(user_id)
        weaklist_ref.set({"weak_tags": weak_tags}, merge=True)

<<<<<<< HEAD
    return JsonResponse({"message": "Quiz submitted successfully", "weak_tags": weak_tags})
=======
    return JsonResponse({"message": "Quiz submitted successfully", "weak_tags": weak_tags})
>>>>>>> 3b89cd29070a18e369c6e33ad8e0e1f73716c97f

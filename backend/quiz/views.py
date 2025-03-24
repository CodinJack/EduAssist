from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import firebase_admin
from firebase_admin import auth, credentials, firestore
from firebase_config import db
from .utils import generate_questions
import re
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
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            topic = data.get("topic")
            numQuestions = data.get("numQuestions")
            difficulty = data.get("difficulty")
            timeLimit = data.get("timeLimit")
            userId = data.get("userId")

            if not topic or not numQuestions or not difficulty or not timeLimit or not userId:
                return JsonResponse({"error": "Missing required fields"}, status=400)

            questions_json = generate_questions(topic, numQuestions, difficulty)
            questions_json = extract_json_from_markdown(questions_json) 


            # Store quiz in Firestore with userId from frontend
            quiz_data = {
                "userId": userId,
                "topic": topic,
                "numQuestions": numQuestions,
                "difficulty": difficulty,
                "timeLimit": timeLimit,
                "questions": questions_json,
                "createdAt": firestore.SERVER_TIMESTAMP
            }
            doc_ref = db.collection("quizzes").add(quiz_data)

            return JsonResponse({"id": doc_ref[1].id, "message": "Quiz created successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_all_quizzes(request):
    try:
        data = json.loads(request.body)
        userId = data.get("userId")

        quizzes_ref = db.collection("quizzes").where("userId", "==", userId).get()
        quizzes = [{"id": doc.id, **doc.to_dict()} for doc in quizzes_ref]
        return JsonResponse(quizzes, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_quiz(request, user_id, quiz_id):
    try:
        doc = db.collection("quizzes").document(quiz_id).get()
        if not doc.exists or doc.to_dict().get("userId") != user_id:
            return JsonResponse({"error": "Quiz not found or unauthorized"}, status=404)
        return JsonResponse({"id": doc.id, **doc.to_dict()}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_quiz(request, user_id, quiz_id):
    try:
        doc_ref = db.collection("quizzes").document(quiz_id)
        doc = doc_ref.get()

        if not doc.exists or doc.to_dict().get("userId") != user_id:
            return JsonResponse({"error": "Quiz not found or unauthorized"}, status=404)

        doc_ref.delete()
        return JsonResponse({"message": "Quiz deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_answer(request, user_id):
    try:
        data = json.loads(request.body)
        quiz_id = data.get("quizId")
        question_id = data.get("questionId")
        attempted_option = data.get("attemptedOption")

        if not quiz_id or not question_id or not attempted_option:
            return JsonResponse({"error": "Invalid data"}, status=400)

        # Get the quiz document
        quiz_ref = db.collection("quizzes").document(quiz_id)
        quiz_doc = quiz_ref.get()

        if not quiz_doc.exists:
            return JsonResponse({"error": "Quiz not found"}, status=404)

        quiz_data = quiz_doc.to_dict()
        if quiz_data.get("userId") != user_id:
            return JsonResponse({"error": "Unauthorized"}, status=403)

        questions = quiz_data.get("questions", [])

        # Update the specific question
        for q in questions:
            if q["id"] == question_id:
                q["attempted_option"] = attempted_option
                break  # Stop searching once found

        # Save the updated questions array back to Firestore
        quiz_ref.update({"questions": questions})

        return JsonResponse({"message": "Answer updated successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

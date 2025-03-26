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
            if len(questions_json) == 0:
                return JsonResponse({"error": "Cannot create quiz"}, status=500)

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
def get_quiz(request, quiz_id):
    try:
        doc = db.collection("quizzes").document(quiz_id).get()
        if not doc.exists:
            return JsonResponse({"error": "Quiz not found or unauthorized"}, status=404)
        return JsonResponse({"id": doc.id, **doc.to_dict()}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_quiz(request):
    try:
        data = json.loads(request.body)
        id = data.get("id")
        doc_ref = db.collection("quizzes").document(id)
        doc = doc_ref.get()

        if not doc.exists:
            return JsonResponse({"error": "Quiz not found or unauthorized"}, status=404)

        doc_ref.delete()
        return JsonResponse({"message": "Quiz deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_answer(request):
    """
    Updates only the attempted_option field of a specific question in a quiz.
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        quiz_id = data.get("quizId")
        question_index = data.get("questionIndex")
        attempted_option = data.get("attemptedOption")

        if quiz_id is None or question_index is None or attempted_option is None:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        quiz_ref = db.collection("quizzes").document(quiz_id)
        quiz_doc = quiz_ref.get()

        if not quiz_doc.exists:
            return JsonResponse({"error": "Quiz not found"}, status=404)

        quiz_data = quiz_doc.to_dict()
        questions = quiz_data.get("questions", [])

        if question_index < 0 or question_index >= len(questions):
            return JsonResponse({"error": "Invalid question index"}, status=400)

        # Update only the attempted_option field
        questions[question_index]["attempted_option"] = attempted_option
        quiz_ref.update({"questions": questions})

        return JsonResponse({"message": "Answer updated successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def submit_quiz(request):
    """
    Submits a quiz, checks attempted_option against correct_answer,
    calculates score, and updates user statistics including number_of_tests_attempted
    and total_marks.
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        quiz_id = data.get("quizId")
        user_id = data.get("userId")

        if not quiz_id:
            return JsonResponse({"error": "Missing quizId"}, status=400)

        # Get the quiz document
        quiz_ref = db.collection("quizzes").document(quiz_id)
        quiz_doc = quiz_ref.get()

        if not quiz_doc.exists:
            return JsonResponse({"error": "Quiz not found"}, status=404)

        quiz_data = quiz_doc.to_dict()
        questions = quiz_data.get("questions", [])
        
        total_questions = len(questions)
        correct_count = 0
        wrong_count = 0
        wrong_tags = {}

        # Check each question's attempted_option against correct_answer
        for question in questions:
            attempted_option = question.get("attempted_option")
            correct_answer = question.get("correct_answer")

            if attempted_option == correct_answer:
                correct_count += 1
            else:
                wrong_count += 1
                tags = question.get("tags", [])
                for tag in tags:
                    if tag in wrong_tags:
                        wrong_tags[tag] += 1
                    else:
                        wrong_tags[tag] = 1


        # Calculate score percentage
        score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0

        # Update the user's statistics
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return JsonResponse({"error": "User not found"}, status=404)
            
        user_data = user_doc.to_dict()
        
        # Get current stats or initialize if they don't exist
        current_tests = user_data.get("number_of_tests_attempted", 0)
        current_total_marks = user_data.get("total_marks", 0)
        
        # Calculate new average marks
        new_tests_count = current_tests + 1
        new_total_marks = ((current_total_marks * current_tests) + score_percentage) / new_tests_count
        new_wrong_tags = [tag for tag, count in wrong_tags.items() if count >= 2]

        # Update user document with new stats
        user_ref.update({
            "number_of_tests_attempted": new_tests_count,
            "total_marks": new_total_marks,
            "wrong_tags" : new_wrong_tags
        })

        return JsonResponse({
            "message": "Quiz submitted successfully",
            "score": {
                "correct": correct_count,
                "wrong": wrong_count,
                "total": total_questions,
                "percentage": score_percentage
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
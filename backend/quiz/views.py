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
def update_answer(request, user_id):
    """
    Updates a user's answer for a specific question in a quiz.
    POST parameters:
    - quizId: ID of the quiz
    - questionId: ID of the question being answered
    - attemptedOption: The option ID that the user selected
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        quiz_id = data.get("quizId")
        question_id = data.get("questionId")
        attempted_option = data.get("attemptedOption")

        if not quiz_id or not question_id or attempted_option is None:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        # Check if quiz exists
        quiz_ref = db.collection("quizzes").document(quiz_id)
        quiz_doc = quiz_ref.get()

        if not quiz_doc.exists:
            return JsonResponse({"error": "Quiz not found"}, status=404)

        # Find the user's attempt or create a new one
        attempt_ref = db.collection("quiz_attempts").where("quizId", "==", quiz_id).where("userId", "==", user_id).limit(1)
        attempt_docs = attempt_ref.get()
        
        if not attempt_docs:
            # Create a new attempt document
            attempt_data = {
                "quizId": quiz_id,
                "userId": user_id,
                "startedAt": firestore.SERVER_TIMESTAMP,
                "answers": {}
            }
            attempt_ref = db.collection("quiz_attempts").document()
            attempt_ref.set(attempt_data)
            attempt_id = attempt_ref.id
        else:
            attempt_id = attempt_docs[0].id
            
        # Update the specific answer in the attempt document
        db.collection("quiz_attempts").document(attempt_id).update({
            f"answers.{question_id}": attempted_option
        })

        return JsonResponse({"message": "Answer updated successfully", "attemptId": attempt_id})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def submit_quiz(request, user_id):
    """
    Submits a quiz, calculates score, and tracks incorrect answers by tag.
    POST parameters:
    - quizId: ID of the quiz
    - answers: Dictionary mapping questionId to attemptedOption
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        quiz_id = data.get("quizId")
        answers = data.get("answers", {})

        if not quiz_id:
            return JsonResponse({"error": "Missing quizId"}, status=400)

        # Get the quiz document
        quiz_ref = db.collection("quizzes").document(quiz_id)
        quiz_doc = quiz_ref.get()

        if not quiz_doc.exists:
            return JsonResponse({"error": "Quiz not found"}, status=404)

        quiz_data = quiz_doc.to_dict()
        questions = quiz_data.get("questions", [])
        
        # Calculate score
        correct_count = 0
        total_questions = len(questions)
        wrong_tags = {}
        
        for question in questions:
            question_id = question["id"]
            attempted_option = answers.get(question_id)
            correct_answer = question.get("correct_answer")
            
            # Skip questions that weren't answered
            if attempted_option is None:
                continue
            
            if attempted_option == correct_answer:
                correct_count += 1
            else:
                # Track tags for incorrect answers
                tags = question.get("tags", [])
                for tag in tags:
                    if tag in wrong_tags:
                        wrong_tags[tag] += 1
                    else:
                        wrong_tags[tag] = 1
        
        # Calculate score percentage
        score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
        
        # Find or create the user's attempt
        attempt_ref = db.collection("quiz_attempts").where("quizId", "==", quiz_id).where("userId", "==", user_id).limit(1)
        attempt_docs = attempt_ref.get()
        
        if not attempt_docs:
            # Create a new completed attempt
            result_data = {
                "quizId": quiz_id,
                "userId": user_id,
                "startedAt": firestore.SERVER_TIMESTAMP,
                "completedAt": firestore.SERVER_TIMESTAMP,
                "answers": answers,
                "correctCount": correct_count,
                "totalQuestions": total_questions,
                "scorePercentage": score_percentage,
                "wrongTags": wrong_tags
            }
            result_ref = db.collection("quiz_results").document()
            result_ref.set(result_data)
            result_id = result_ref.id
        else:
            # Update the existing attempt
            attempt_id = attempt_docs[0].id
            
            # Create results document
            result_data = {
                "quizId": quiz_id,
                "userId": user_id,
                "attemptId": attempt_id,
                "completedAt": firestore.SERVER_TIMESTAMP,
                "correctCount": correct_count,
                "totalQuestions": total_questions,
                "scorePercentage": score_percentage,
                "wrongTags": wrong_tags
            }
            result_ref = db.collection("quiz_results").document()
            result_ref.set(result_data)
            result_id = result_ref.id
            
            # Mark the attempt as completed
            db.collection("quiz_attempts").document(attempt_id).update({
                "completedAt": firestore.SERVER_TIMESTAMP,
                "resultId": result_id
            })

        return JsonResponse({
            "message": "Quiz submitted successfully",
            "resultId": result_id,
            "score": {
                "correct": correct_count,
                "total": total_questions,
                "percentage": score_percentage
            },
            "wrongTags": wrong_tags
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Quiz, Question
from .serializers import QuizSerializer
from .utils import generate_questions
from django.http import JsonResponse
from .utils import store_test_results
import json

@api_view(['POST'])
def create_quiz(request):
    topic = request.data.get("topic")
    num_questions = request.data.get("num_questions")
    difficulty = request.data.get("difficulty")

    if not topic or not num_questions or not difficulty:
        return Response({"error": "Topic and number of questions and difficulty are required"}, status=400)

    # Generate questions using Gemini API
    questions_json = generate_questions(topic, num_questions, difficulty)
    print(f"Generated Questions: {questions_json}")  # Debugging
    cleaned_json = questions_json.strip("```json").strip("```")

    try:
        questions_data = json.loads(cleaned_json)  # Convert string to JSON
    except json.JSONDecodeError:
        print("ERROR: Invalid JSON format received from Gemini API")  # Debugging
        return Response({"error": "Invalid JSON format received from Gemini API"}, status=500)

    # Create and save quiz
    quiz = Quiz.objects.create(topic=topic, num_questions=num_questions, difficulty=difficulty)

    # Save questions
    for q in questions_data:
        Question.objects.create(
            quiz=quiz,
            text=q["question"],
            option1=q["options"]["a"],
            option2=q["options"]["b"],
            option3=q["options"]["c"],
            option4=q["options"]["d"],
            correct_answer=q["correct_answer"],
            difficulty=q["difficulty"],
            attempted_option="",
            tags=q["tags"]
        )

    return Response(QuizSerializer(quiz).data)

@api_view(['GET'])
def get_quiz_questions(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=404)
    


def submit_test(request):
    if request.method == "POST":
        data = request.json  # Assuming JSON input
        user_id = data.get("user_id")
        test_id = data.get("test_id")
        weak_tags = data.get("weak_tags", [])
        score = data.get("score", 0)

        if not user_id or not test_id:
            return JsonResponse({"error": "User ID and Test ID required"}, status=400)

        message = store_test_results(user_id, test_id, weak_tags, score)
        return JsonResponse({"message": message})


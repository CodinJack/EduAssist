from .utils import generate_questions
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
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


@csrf_exempt  # Disable CSRF for testing (not recommended in production)
@require_POST  # Only allow POST requests
def create_practice_questions(request):
    try:
        data = json.loads(request.body)
        topic = data.get("topic")
        
        if not topic:
            return JsonResponse({"error": "Topic is required"}, status=400)

        # Your logic to generate questions
        questions = generate_questions(topic) 
        if len(questions) == 0:
            return JsonResponse({"error": "Cannot create practice questions!"}, status=500)

        questions = extract_json_from_markdown(questions) 
        return JsonResponse({"questions": questions}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

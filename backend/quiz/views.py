from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer
import random

@api_view(['GET'])
def get_questions(request):
    topic = request.GET.get('topic', None)  # Get topic from request
    if topic:
        questions = Question.objects.filter(tags__contains=topic)
    else:
        questions = Question.objects.all()
    
    questions = random.sample(list(questions), min(15, len(questions)))  # Get 15 random questions
    serializer = QuestionSerializer(questions, many=True)
    
    return Response(serializer.data)

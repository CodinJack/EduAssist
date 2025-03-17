from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from utils.firebase import db  # Make sure path is correct

@csrf_exempt
def add_student(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            branch = data.get('branch')

            doc_ref = db.collection('students').add({
                'name': name,
                'email': email,
                'branch': branch
            })

            return JsonResponse({"status": "success", "doc_id": doc_ref[1].id})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid method"}, status=405)

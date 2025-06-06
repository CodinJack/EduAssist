from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_notes
import os
from django.views.decorators.http import require_GET
import requests

@csrf_exempt
def search_youtube_videos(request):
    """Search for educational YouTube videos based on query param 'q'"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed."}, status=405)
    
    try:
        data = json.loads(request.body.decode("utf-8"))
        query = data.get("q", "").strip()
        if not query:
            return JsonResponse({"error": "Search query is required."}, status=400)

        # Enhance search to be educational
        safe_query = f"{query} educational"

        api_key = os.getenv("YOUTUBE_API_KEY")
        if not api_key:
            return JsonResponse({"error": "YouTube API key not configured in environment."}, status=500)

        base_url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "maxResults": 15,
            "q": safe_query,
            "type": "video",
            "videoEmbeddable": "true",
            "key": api_key,
        }

        response = requests.get(base_url, params=params)
        if response.status_code != 200:
            try:
                error_msg = response.json().get('error', {}).get('message', 'Unknown error')
            except Exception:
                error_msg = 'Unknown error while parsing YouTube API response.'
            return JsonResponse({"error": f"YouTube API error: {error_msg}"}, status=500)

        data = response.json()

        # Optionally extract and simplify data if needed
        videos = [
            {
                "title": item["snippet"]["title"],
                "videoId": item["id"]["videoId"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "channelTitle": item["snippet"]["channelTitle"],
                "publishedAt": item["snippet"]["publishedAt"],
            }
            for item in data.get("items", [])
        ]

        return JsonResponse({"videos": videos, "message": "Videos fetched successfully."}, status=200)

    except Exception as e:
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

@csrf_exempt
def create_notes(request):
    """Create notes generated by AI"""
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
        userId = data.get("userId")

        # Validate required fields
        if not topic:
            return JsonResponse({"error": "Topic is required"}, status=400)

        # Generate notes
        notes = generate_notes(topic)

        # Validate notes
        if not notes or len(notes.strip()) == 0:
            return JsonResponse({"error": "Failed to generate notes"}, status=500)

        # Return the generated notes to the frontend
        notes_data = {
            "userId": userId,
            "topic": topic,
            "notes": notes
        }

        return JsonResponse({
            "data": notes_data,
            "message": "Notes generated successfully"
        }, status=200)

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JsonResponse({"error": f"Unexpected server error: {str(e)}"}, status=500)

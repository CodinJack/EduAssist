import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=f"{GEMINI_API_KEY}")
model = genai.GenerativeModel("models/gemini-1.5-flash")


def getResponse(prompt: str):
    print("sending request")
    response = model.generate_content(
        f"{prompt}. Generate in plain text without markdown"
    )
    print("request received")
    return response.text


if __name__ == "__main__":
    while True:
        prompt = input("Enter prompt: ")
        response = getResponse(prompt)
        print(response)

from fastapi import FastAPI
from chat import getResponse

app = FastAPI()


"""
url: /api/v1/chat?prompt=<prompt>

process the prompt and send the message back to frontend.
"""


@app.post("/api/v1/chat/")
def chat(prompt: str = ""):
    if prompt == "":
        return ""
    return {"Response: ": getResponse(prompt)}

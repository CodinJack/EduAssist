from fastapi import FastAPI, Request, HTTPException
from chat import getResponse
from collections import defaultdict

app = FastAPI()

chat_history = defaultdict(list)
"""
url: /api/v1/chat?prompt=<prompt>

process the prompt and send the message back to frontend.
"""


@app.post("/api/v1/chat/")
async def chat(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    prompt = data.get("message")
    if prompt == "":
        return ""

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    if not prompt:
        return {"Response": "No message provided"}
    history = chat_history.get(user_id, [])
    print("History: ", history)
    history_text = "\n".join(history[-5:]) if history else "No previous messages"
    full_prompt = f"{history_text}\n{prompt}"
    print(full_prompt)
    message = await getResponse(full_prompt)
    chat_history[user_id].append(prompt)
    return {"Response": message}

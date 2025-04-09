"""
Main File For Running FastAPI
"""
from fastapi import Depends, FastAPI, status, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from sqlmodel import Session
from dotenv import load_dotenv
import os
import requests
from typing import List, Dict, Any
from .deps import get_db, get_user
from .routers import auth, user

# load environment variables
load_dotenv()

# main app for FastAPI
app = FastAPI()

# Define your allowed origins
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3001",
]


# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


@app.get("/")
def health_check():
    """
    health check for FastAPI routes
    """
    return 'Health check complete'

app.include_router(auth.router)
app.include_router(user.router)

# get all routes for each website
# app.include_router(auth_routes.router) # authentication routes
# app.include_router(calorie_routes.router) # calorie tracker website regular routes

DEEPSEEK_KEY = os.getenv("DEEPSEEK_KEY")
DEEPSEEK_URL = os.getenv("DEEPSEEK_URL")

headers = {
    'Authorization': f'Bearer {DEEPSEEK_KEY}',
    'Content-Type': 'application/json'
}

# global conversation history (for demo purposes; in production, maintain per-session or per-user history)
conversation_history: List[Dict[str, Any]] = [
    {
        "role": "system",
        "content": (
            "This conversation is part of a health app. You are a friendly assistant who offers support on exercise and nutrition topics. "
            "Please refer users to the eating disorder hotline at 1-888-375-7767 if severe symptoms are detected."
        )
    }
]

@app.post("/chat", status_code=status.HTTP_200_OK)
async def chat_endpoint(message: str = Body(..., embed=True)):
    """
    Accepts a chat message from the front end, appends it to the conversation history,
    sends the updated conversation to the DeepSeek API, then returns the assistant's reply.
    """
    # append user's message.
    conversation_history.append({"role": "user", "content": message})

    # prepare data to send to DeepSeek API
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": conversation_history
    }
    
    try:
        # send request to DeepSeek API
        response = requests.post(DEEPSEEK_URL, json=data, headers=headers)
        
        # convert response into json
        response_json = response.json()
        
        # if response is not valid or empty
        if response.status_code != 200 or "error" in response_json:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response_json.get("error", {}))
        
        # get assistant's reply from response
        assistant_reply = response_json['choices'][0]['message']['content']
        
        # append assistant's reply to conversation history
        conversation_history.append({"role": "assistant", "content": assistant_reply})
        
        # return chatbot's reply to front end
        return {"reply": assistant_reply}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

"""
Main File For Running FastAPI
"""
from fastapi import Depends, FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from sqlmodel import Session
from .routers import auth
from .routers import user
from api.database import Base, engine

# import custom routers
# from .calorie_tracker import calorie_routes
# from .authentication import auth_routes

# import functions
# from .authentication.auth_routes import get_current_user
# from .db_dependencies import get_session


# main app for FastAPI
app = FastAPI()

Base.metadata.create_all(bind=engine)


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

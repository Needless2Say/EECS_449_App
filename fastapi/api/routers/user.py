from datetime import timedelta, datetime, timezone
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from api.database import User, Gender
from api.deps import db_dependency, bcrpyt_context
from sqlmodel import select
from api.database import Gender, ActivityLevel, FitnessGoals

load_dotenv()

# Generate FASTAPI router /auth for authentication endpoints
router = APIRouter(
    prefix='/user',
    tags=['user']
)

# Grabs SECRET_KEY and ALGORITHM from .env
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

class Config:
    orm_mode: bool = True

@router.post('/preferences', status_code=status.HTTP_201_CREATED)
async def get_data(db: db_dependency, request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing token")

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")

        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    user = db.exec(select(User).where(User.id == int(user_id))).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user_data = await request.json()

    #turn inputs into data types of database, some inputs lists, have to turn into comma separated strings
    user.age = int(user_data.get("age")) or user.age #looks for age in Json data, turns into int, else sets to user.age
    user.height_cm = float(user_data.get("height")) or user.height_cm
    user.weight_kg = float(user_data.get("weight")) or user.weight_kg
    user.gender = Gender(user_data.get("gender")) or user.gender
    user.activity_level = user_data.get("activityLevel", user.activity_level)
    user.diet_preference = user_data.get("dietPreference") or user.diet_preference
    user.allergies = ",".join(user_data.get("allergyArray", [])) or user.allergies

    user.exercise_preference = ",".join(user_data.get("exercisePreference", [])) or user.exercise_preference
    user.fitness_goals = user_data.get("fitnessGoals") or user.fitness_goals
    user.meal_prep_availability = ",".join(user_data.get("mealPrepAvailability", [])) or user.meal_prep_availability
    user.exercise_availability = ",".join(user_data.get("exerciseAvailability", [])) or user.exercise_availability

    db.commit()
    db.refresh(user)

    return {"message": "User preferences updated successfully"}   
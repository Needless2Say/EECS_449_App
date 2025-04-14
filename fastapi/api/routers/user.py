from datetime import timedelta, datetime, timezone
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from api.database import User, Gender, ExercisePreferences, FitnessGoals, DayOfWeek, ActivityLevel
from api.deps import db_dependency, bcrpyt_context, user_dependency
from sqlmodel import select
from api.database import Gender, ActivityLevel, FitnessGoals
from api.models import create_meal_plan, parse_meal_plan_to_dict, create_exercise_routine, parse_exercise_routine_to_dict
from api.models import (
    extract_keywords_liked_meal,
    extract_keywords_disliked_meal,
    extract_keywords_liked_workout,
    extract_keywords_disliked_workout
)


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


async def get_user(db, request):
    auth_header = request.headers.get("Authorization")
    print(auth_header)
    if not auth_header or not auth_header.startswith("Bearer "):
        print("Invalid or missing token")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing token")

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        print(user_id)

        if user_id is None:
            print("Invalid token")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    except JWTError:
        print("Could not validate credentials")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    user = db.exec(select(User).where(User.id == int(user_id))).first()
    if not user:
        print("User not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    else:
        print("VALID USER")
        return user


@router.post('/preferences', status_code=status.HTTP_201_CREATED)
async def get_data(db: db_dependency, request: Request):
    print("USER PREFERENCES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    user = await get_user(db, request)
    print("USER PREFERENCES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    user_data = await request.json()

    #turn inputs into data types of database, some inputs lists, have to turn into comma separated strings
    user.age = int(user_data.get("age")) or user.age #looks for age in Json data, turns into int, else sets to user.age
    user.height_cm = float(user_data.get("height")) or user.height_cm
    user.weight_kg = float(user_data.get("weight")) or user.weight_kg
    user.gender = Gender(user_data.get("gender")) or user.gender
    user.activity_level = ActivityLevel(user_data.get("activityLevel")) or user.activity_level
    user.diet_preference = user_data.get("dietPreference") or user.diet_preference
    user.allergies = ",".join(user_data.get("allergyArray", [])) or user.allergies


    user.exercise_preferences = [ExercisePreferences(item) for item in user_data.get("exercisePreference", [])] or user.exercise_preferences
    user.fitness_goals = [FitnessGoals(item) for item in user_data.get("fitnessGoals", [])] or user.fitness_goals
    user.meal_prep_availability = [DayOfWeek(item) for item in user_data.get("mealPrepAvailability", [])] or user.meal_prep_availability
    user.exercise_availability = [DayOfWeek(item) for item in user_data.get("exerciseAvailability", [])] or user.exercise_availability

    db.commit()
    db.refresh(user)

    print("IT WORKS!!!!!!!!!!!!!!!!!!!!")

    return {"message": "User preferences updated successfully"}   

@router.post('/meals', status_code=status.HTTP_201_CREATED)
async def gen_meal_plan(db: db_dependency, request: Request):
    #need to decode header and get token for user_id if i'm going to store the meal plan data in the db to identify user.
    user = await get_user(db, request)
    
    try:
        print("GENERATING MEAL PLAN")
        raw_meal_plan = create_meal_plan(user.id)
        print("MEAL PLAN GENERATED")
        meal_plan_dict = parse_meal_plan_to_dict(raw_meal_plan)
        print(meal_plan_dict)

        # update user's meal plan in the database
        user.meal_plan = meal_plan_dict
        db.add(user)
        db.commit()
        db.refresh(user)

        return {"meal_plan": meal_plan_dict}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error generating meal plan: {str(e)}")
    
@router.post('/workouts', status_code=status.HTTP_201_CREATED)
async def gen_workout_plan(db: db_dependency, request: Request):
    #need to decode header and get token for user_id if i'm going to store the exercise plan data in the db to identify user.
    user = await get_user(db, request)

    try:
        print("GENERATING WORKOUT PLAN")
        raw_exercise_plan = create_exercise_routine(user.id)
        print("WORKOUT PLAN GENERATED")
        exercise_plan_dict = parse_exercise_routine_to_dict(raw_exercise_plan)
        print(exercise_plan_dict)
        
        # update user's workout plan in the database
        user.workout_plan = exercise_plan_dict
        db.add(user)
        db.commit()
        db.refresh(user)

        return {"excercise_plan": exercise_plan_dict}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error generating workout plan: {str(e)}")

@router.post('/keywords/liked-meal', status_code=status.HTTP_200_OK)
async def liked_meal(db: db_dependency, request: Request):
    #get user from request header to get user.id, then get request JSON which will hold the text that we pass into the function
    user = await get_user(db, request)
    meal_data = await request.json()

    #pass in user.id and user inputted text, function stores info into database for user.
    extract_keywords_liked_meal(meal_data.get("text"), user.id)

    return {"message": "Liked meal keywords extracted and stored"}

@router.post('/keywords/disliked-meal', status_code=status.HTTP_200_OK)
async def disliked_meal(db: db_dependency, request: Request):
    #get user from request header to get user.id, then get request JSON which will hold the text that we pass into the function
    user = await get_user(db, request)
    meal_data = await request.json()

    #pass in user.id and user inputted text, function stores info into database for user.
    extract_keywords_disliked_meal(meal_data.get("text"), user.id)

    return {"message": "Disliked meal keywords extracted and stored"}

@router.post('/keywords/disliked-workout', status_code=status.HTTP_200_OK)
async def disliked_workout(db: db_dependency, request: Request):
    #get user from request header to get user.id, then get request JSON which will hold the text that we pass into the function
    user = await get_user(db, request)
    workout_data = await request.json()

    #pass in user.id and user inputted text, function stores info into database for user.
    extract_keywords_disliked_workout(workout_data.get("text"), user.id)

    return {"message": "Disliked workout keywords extracted and stored"}

@router.post('/keywords/liked-workout', status_code=status.HTTP_200_OK)
async def liked_workout(db: db_dependency, request: Request):
    #get user from request header to get user.id, then get request JSON which will hold the text that we pass into the function
    user = await get_user(db, request)
    workout_data = await request.json()

    #pass in user.id and user inputted text, function stores info into database for user.
    extract_keywords_liked_workout(workout_data.get("text"), user.id)

    return {"message": "Liked workout keywords extracted and stored"}


@router.get("/meal-plan", status_code=status.HTTP_200_OK)
async def get_user_meal_plan(db: db_dependency, request: Request):
    """
    Retrieves the current user's stored meal plan from the database.
    """
    print("HIT GET USER MEAL PLAN")
    user = await get_user(db, request)
    if not user:
        print("User not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    print("USER MEAL PLAN")
    print(user.meal_plan)
    
    return {"meal_plan": user.meal_plan}


@router.get("/workout-plan", status_code=status.HTTP_200_OK)
async def get_user_workout_plan(db: db_dependency, request: Request):
    """
    Retrieves the current user's stored workout plan from the database.
    """
    print("HIT GET USER WORKOUT PLAN")
    user = await get_user(db, request)
    if not user:
        print("User not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    print("USER WORKOUT PLAN")
    print(user.workout_plan)

    return {"workout_plan": user.workout_plan}


@router.post("/weekly-survey", status_code=status.HTTP_200_OK)
async def post_weekly_survey(db: db_dependency, request: Request):
    """
    Store user's weekly satisfaction survey response in the database
    """
    # get user from database
    user = await get_user(db, request)
    if not user:
        print("User not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # get survey data from request
    survey_data = (await request.json())["feedbackData"]

    # check if user wants workout plan to be re-generated
    if survey_data["workout"]["newPlan"] is True:
        try:
            print("GENERATING WORKOUT PLAN")
            raw_exercise_plan = create_exercise_routine(user.id)
            print("WORKOUT PLAN GENERATED")
            exercise_plan_dict = parse_exercise_routine_to_dict(raw_exercise_plan)
            print(exercise_plan_dict)

            # update user's workout plan in the database
            user.workout_plan = exercise_plan_dict
            db.add(user)
            db.commit()
            db.refresh(user)

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error generating workout plan: {str(e)}")


    # check if user wants meal plan to be re-generated
    if survey_data["meals"]["newPlan"] is True:
        try:
            print("GENERATING MEAL PLAN")
            raw_meal_plan = create_meal_plan(user.id)
            print("MEAL PLAN GENERATED")
            meal_plan_dict = parse_meal_plan_to_dict(raw_meal_plan)
            print(meal_plan_dict)

            # update user's meal plan in the database
            user.meal_plan = meal_plan_dict
            db.add(user)
            db.commit()
            db.refresh(user)

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error generating meal plan: {str(e)}")


    return {"survey_data": survey_data}

















@router.get("/all_users", response_model=list[User], status_code=status.HTTP_200_OK)
async def get_all_users(db: db_dependency):
    """
    Get all users from the database.
    """
    statement = select(User)
    users = db.exec(statement).all()
    return users

from datetime import timedelta, datetime, timezone
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from api.database import User
from api.deps import db_dependency, bcrpyt_context
from sqlmodel import select
from api.database import Gender, ActivityLevel, FitnessGoals

load_dotenv()

# Generate FASTAPI router /auth for authentication endpoints
router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

# Grabs SECRET_KEY and ALGORITHM from .env
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

class Config:
    orm_mode: bool = True

# Defines response structure for authentication tokens
class Token(BaseModel):
    access_token: str
    token_type: str


# auth_user searches for a user in our db, filtering by username
# Verifies password with stored hashed password
# If authentication is successful, returns User object
def auth_user(username: str, password: str, db):
    user = db.exec(select(User).where(User.username == username)).first()
    if not user:
        return False
    if not bcrpyt_context.verify(password, user.hashed_password):
        return False
    return user

# Generates a JWT token with the users username, user_id, and an expiration timestamp (10 minutes)
# Encodes and returns Token
def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encrypt = {'sub': username, 'id': user_id}
    token_expires = datetime.now(timezone.utc) + expires_delta
    encrypt.update({'exp': token_expires})
    return jwt.encode(encrypt, SECRET_KEY, algorithm=ALGORITHM)

# This route parses incoming payload and creates an instance of UserRequest
# It then creates new user entry in our database with the users username and hashed password
# Returns an error if username is already registered
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_new_user(db: db_dependency, create_user_request: User):
    existing_user = db.exec(select(User).where(User.username == create_user_request.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    create_user_model = User(
        username=create_user_request.username,
        hashed_password=bcrpyt_context.hash(create_user_request.hashed_password),
        email=create_user_request.email,
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        age=create_user_request.age,
        gender=create_user_request.gender,
        height_cm=create_user_request.height_cm,
        weight_kg=create_user_request.weight_kg,
        activity_level=create_user_request.activity_level,
        fitness_goals=create_user_request.fitness_goals,
        exercise_preference=create_user_request.exercise_preference,
        diet_preference=create_user_request.diet_preference,
        allergies=create_user_request.allergies,
        meal_prep_availability=create_user_request.meal_prep_availability,
        exercise_availability=create_user_request.exercise_availability
    )
    db.add(create_user_model)
    db.commit()

# Receives login credentials and calls auth_user to verify with values in our db
# Generates token if successful using create_access_token
# Returns token
@router.post('/token', response_model=Token)
async def access_token_login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = auth_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Problem Validating User"
        )
    token = create_access_token(user.username, user.id, timedelta(minutes=10))
    return {'access_token': token, 'token_type': 'bearer'} 

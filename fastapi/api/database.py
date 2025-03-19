from sqlmodel import create_engine, Session, text, delete, Field, SQLModel
from sqlalchemy import Column, JSON
from dotenv import load_dotenv
import os
from enum import Enum
from typing import Optional


load_dotenv()
SQL_ALCHEMY_DATABASE_URL = os.getenv("SQL_ALCHEMY_DATABASE_URL")


engine = create_engine(SQL_ALCHEMY_DATABASE_URL, echo=True)

class ActivityLevel(str, Enum):
    SEDENTARY = "Sedentary"
    LIGHTLY_ACTIVE = "Lightly Active"
    MODERATELY_ACTIVE = "Moderately Active"
    VERY_ACTIVE = "Very Active"


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"
    PREFER_NOT_TO_SAY = "Prefer not to say"

class FitnessGoals(str, Enum):
    WEIGHT_LOSS = "Weight Loss"
    GAIN_MUSCLE = "Gain Muscle"
    INCREASE_ENDURANCE = "Increase Endurance"
    IMPROVE_FLEXIBILITY = "Improve Flexibility"
    GENERAL_FITNESS = "General Fitness"
    SPORTS_PERFORMANCE = "Sports Performance"
    MAINTAIN_WEIGHT = "Maintain Weight"


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str = Field(unique=True)

    age: Optional[int]
    gender: Optional[Gender] = Field(default=None)
    height_cm: Optional[float]
    weight_kg: Optional[float]
    activity_level: Optional[ActivityLevel] = None
    fitness_goals: list[FitnessGoals] = Field(default_factory=list, sa_column=Column(JSON))

    exercise_preference: Optional[str] = None  # CSV format like "Cardio,Strength Training"
    diet_preference: Optional[str] = None  # CSV format like "Vegan,Keto"
    allergies: Optional[str] = None  # CSV format like "Nuts,Dairy"

    # dark_mode_enabled: Optional[bool] = Field(default=False)

    meal_prep_availability: Optional[str] = None  # Example: "Mornings, Weekends"
    exercise_availability: Optional[str] = None  # Example: "6 AM - 7 AM, 5 PM - 6 PM"


# Separate table for detailed availability
class UserAvailability(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    type: str = Field(index=True)  # "meal" or "exercise"
    day: str = Field(index=True)  # "Monday", "Tuesday", etc.
    start_time: str  # Stored as "HH:MM"
    end_time: str  # Stored as "HH:MM"
    

def get_engine():
    """
    Get Engine To Database
    """
    return create_engine(SQL_ALCHEMY_DATABASE_URL, echo=True)


def get_session():
    """
    Get Connection and Create Session to Database
    """
    engine = get_engine()
    return Session(engine)


Base = SQLModel  

from sqlmodel import SQLModel, Field, create_engine, Session, Column, select, delete
from sqlalchemy import JSON
from enum import Enum
from typing import Optional
import requests
import datetime
import os
# from .deps import get_engine
from dotenv import load_dotenv
import os


load_dotenv()

# Grab SECRET_KEY and ALGORITHM from our .env folder
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")
SQL_ALCHEMY_DATABASE_URL = os.getenv("SQL_ALCHEMY_DATABASE_URL")


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


if os.path.exists("orm.db"):
    os.remove("orm.db")


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
    
class ExercisePreferences(str, Enum):
    CARDIO = "Cardio"
    STRENGTH_TRAINING = "Strength Training"
    FLEXIBILITY_MOBILITY = "Flexibility & Mobility"
    HIIT = "High-Intensity Interval Training (HIIT)"


class DayOfWeek(str, Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"   
    

class User(SQLModel, table=True):
    id: int = Field(primary_key=True, sa_column_kwargs={"autoincrement": True})
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password: str = Field(unique=True)
    first_name: Optional[str] 
    last_name: Optional[str] 
    age: Optional[int]
    gender: Optional[Gender] = Field(default=None, sa_column=Column(JSON))
    height_cm: Optional[float]
    weight_kg: Optional[float]
    
    activity_level: Optional[ActivityLevel] = Field(default=None, sa_column=Column(JSON))
    fitness_goals: Optional[list[FitnessGoals]] = Field(default_factory=list, sa_column=Column(JSON))
    exercise_preferences: Optional[list[ExercisePreferences]] = Field(default_factory=list, sa_column=Column(JSON))  # Updated field
    diet_preference: Optional[str] = None  # CSV format like "Vegan,Keto"
    allergies: Optional[str] = None  # CS2V format like "Nuts,Dairy"
    exercise_availability: Optional[list[DayOfWeek]] = Field(default_factory=list, sa_column=Column(JSON))
    meal_prep_availability: Optional[list[DayOfWeek]] = Field(default_factory=list, sa_column=Column(JSON))

    # columns for meal and workout plans
    meal_plan: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    workout_plan: Optional[dict] = Field(default=None, sa_column=Column(JSON))

    # meal preferences
    liked_meals: Optional[list[str]] = Field(default_factory=list, sa_column=Column(JSON))
    disliked_meals: Optional[list[str]] = Field(default_factory=list, sa_column=Column(JSON))
    
    # workout preferences
    liked_workouts: Optional[list[str]] = Field(default_factory=list, sa_column=Column(JSON))
    disliked_workouts: Optional[list[str]] = Field(default_factory=list, sa_column=Column(JSON))


# Create all tables
engine = get_engine()
SQLModel.metadata.create_all(engine)


# Example: usage with a session (we created a random user and tested)
# with Session(get_engine()) as session:
#     session.exec(delete(User))
#     session.commit()
#     print("All users and workout plans deleted.")

#     # Create a new user
#     user = User(
#         username="john",
#         email="john@example.com",
#         password="1234",
#         first_name="John",
#         last_name="Doe",
#         age=30,
#         gender=[Gender.MALE],
#         height_cm=180.0,
#         weight_kg=75.0,
#         activity_level=[ActivityLevel.MODERATELY_ACTIVE],
#         fitness_goals=[FitnessGoals.WEIGHT_LOSS, FitnessGoals.GAIN_MUSCLE],
#         exercise_preferences=[ExercisePreferences.CARDIO, ExercisePreferences.STRENGTH_TRAINING],
#         diet_preference="Vegan",
#         allergies="Nuts",
#         exercise_availability=[DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY, DayOfWeek.SUNDAY],
#     )

#     # Add and commit the user
#     session.add(user)
#     session.commit()


# for testing
def print_user_info(): 
    # Create a session
    engine = get_engine()
    with Session(engine) as session:
        # Query all users
        statement = select(User)
        users = session.exec(statement).all()

        # Check if any users exist
        if not users:
            print("No users found in the database.")
            return

        # Print details for each user
        for user in users:
            print("\n--- User Information ---")
            print(f"ID: {user.id}")
            print(f"Username: {user.username}")
            print(f"Email: {user.email}")
            print(f"First Name: {user.first_name}")
            print(f"Last Name: {user.last_name}")
            print(f"Age: {user.age}")
            print(f"Gender: {user.gender}")
            print(f"Height (cm): {user.height_cm}")
            print(f"Weight (kg): {user.weight_kg}")
            print(f"Activity Level: {user.activity_level}")
            print(f"Fitness Goals: {', '.join(user.fitness_goals)}")
            print(f"Exercise Preference: {', '.join(user.exercise_preferences)}")
            print(f"Diet Preference: {user.diet_preference}")
            print(f"Allergies: {user.allergies}")
            print(f"Exercise Availability: {', '.join(user.exercise_availability)}")
            print(f"Liked Meals: {', '.join(user.liked_meals)}")
            print(f"Disiked Meals: {', '.join(user.disliked_meals)}")
            print(f"Liked Workouts: {', '.join(user.liked_workouts)}")
            print(f"Disliked Workouts: {', '.join(user.disliked_workouts)}")
            print(f"Meal Plan: {user.meal_plan}")
            print(f"Workout Plan: {user.workout_plan}")
            print("------------------------")
            
# Call the function to print user information (for testing)
print_user_info()





# def check_users(): 
#     # Create a session
#     with Session(get_engine()) as session:
#         # Query all users
#         statement = select(User)
#         users = session.exec(statement).all()
#         print(len(users))
#         print()
#         print(users)
        
# print("\n\n USERSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS \n")
# check_users()

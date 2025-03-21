"""
Models For Calorie Tracker Website
"""
from sqlmodel import SQLModel, Field, Relationship, String, Column, ForeignKey, UniqueConstraint, Session, select, delete, create_engine
from typing import Optional
# from sqlalchemy import Column, Integer, String, ForeignKey, Table
# from sqlalchemy.orm import relationship
# from .database import Base
import os
import re
import ollama
import requests
import json

# Add all the table names here
from database import User

#from database import engine
#SQLModel.metadata.create_all(engine)
#engine = create_engine('sqlite:///orm.db', echo=True)

engine = create_engine('sqlite:///orm.db')

# REMOVE API KEY BEFORE PUSHING TO GIT
API_KEY = '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'
API_URL = 'https://openrouter.ai/api/v1/chat/completions'


# Define the headers for the API request
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

def create_meal_plan(User_Name):
    user_context = ''
    
    with Session(engine) as session:
        # Query the user by ID
        statement = select(User).where(User.username == User_Name)

        user = session.exec(statement).first()
        print(f'---------- {user.username} ---------')

        user_context = (
            f"{user.age}-year-old {user.gender if user.gender else 'person'} "
            f"weighing {user.weight_kg} kg and {user.height_cm} cm tall, "
            f"with {user.activity_level if user.activity_level else 'unspecified'} activity level, "
            f"aiming for {', '.join(goal for goal in user.fitness_goals)}, "
            f"following a {user.diet_preference if user.diet_preference else 'flexible'} diet, "
            f"avoiding {user.allergies if user.allergies else 'no specific allergies'}, "
        )
    
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{
            "role": "user",
            "content": (
                f"I am [{user_context}]. Help me create a 7-day meal plan with breakfast, lunch, and dinner. "
                f"The meals should be balanced, nutritious, and supportive of my goals, with flexibility in portion sizes "
                f"to avoid strict calorie restrictions. Prioritize whole foods and avoid unhealthy options like excessive "
                f"processed foods or sugary snacks. If muscle gain is a goal, emphasize protein-rich options. "
                f"Meal prep should take no more than 30 minutes for each meal. "
                f"Return the output in this format: day_breakfast_lunch_dinner. "
                f"For example: Monday_eggs with ham_grilled chicken with veggies_steak with rice. "
                f"Only return this parsed output, no extra text."
                )
        }]
    }

    # Send the POST request to the DeepSeek API
    response = requests.post(API_URL, json=data, headers=headers)

    response_json = response.json()
    assistant_content = response_json['choices'][0]['message']['content']
    return assistant_content


def create_exercise_routine(User_Name):
    user_context = ''
    
    with Session(engine) as session:
        statement = select(User).where(User.username == User_Name)
        user = session.exec(statement).first()
        print(f'---------- {user.username} ---------')

        user_context = (
            f"{user.age}-year-old {', '.join(str(gender) for gender in user.gender) if user.gender else 'person'} "
            f"weighing {user.weight_kg} kg and {user.height_cm} cm tall, "
            f"with {', '.join(str(level) for level in user.activity_level) if user.activity_level else 'unspecified'} activity level, "
            f"aiming for {', '.join(str(goal) for goal in user.fitness_goals)}, "
            f"preferring {', '.join(str(pref) for pref in user.exercise_preferences)} exercises, "
            f"and available to exercise {', '.join(str(day) for day in user.exercise_availability)}, "
        )

    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{
            "role": "user",
            "content": (
                f"I am [{user_context}]. Help me create a exercise routine plan. "
                f"Only include workouts for days that I am available to exercise. "
                f"The exercises should be not super extreme and supportive of my goals. "
                f"The workout plan per day should last no more than one hour. "
                f"Return the output in this format: day_NumberOfSets_NumberOfReps_workoutName... "
                f"For example: Monday_3_12_bicep curl_3_10_triceps extension_4_15_wrist curl. "
                f"Notice that first we have the day (string), then a _ the Number of Sets (int), then a _ the Number of Reps (int), "
                f"and a _ and the exercise name, also notice that one day can have many exercises, "
                f"only return this parsed output, no extra text."
            )
        }]
    }
    
    # Send the POST request to the DeepSeek API
    response = requests.post(API_URL, json=data, headers=headers)
    
    response_json = response.json()
    assistant_content = response_json['choices'][0]['message']['content']
    return assistant_content

def parse_meal_plan_to_dict(meal_plan_text):
    """
    Convert meal plan text into a dictionary.
    """
    meal_plan_dict = {}
    lines = meal_plan_text.strip().split('\n')
    for line in lines:
        if not line or '_' not in line:
            continue
        parts = line.split('_')
        if len(parts) != 4:
            continue
        day, breakfast, lunch, dinner = parts
        meal_plan_dict[day] = {
            "breakfast": breakfast,
            "lunch": lunch,
            "dinner": dinner
        }
    return meal_plan_dict

def parse_exercise_routine_to_dict(exercise_routine_text):
    """
    Convert exercise routine text into a dictionary.
    """
    exercise_routine_dict = {}
    lines = exercise_routine_text.strip().split('\n')
    for line in lines:
        if not line or '_' not in line:
            continue
        parts = line.split('_')
        if len(parts) < 4 or len(parts) % 3 != 1:  # Expect day + sets of (sets_reps_exercise)
            continue
        day = parts[0]
        exercises = []
        # Process in chunks of 3 (sets, reps, exercise name)
        for i in range(1, len(parts), 3):
            if i + 2 < len(parts):  # Ensure we have sets, reps, and exercise
                sets = parts[i]
                reps = parts[i + 1]
                exercise = parts[i + 2]
                exercises.append({
                    "sets": int(sets),
                    "reps": int(reps),
                    "exercise": exercise
                })
        exercise_routine_dict[day] = exercises
    return exercise_routine_dict

def save_to_json(data_dict, filename):
    """
    Save a dictionary to a JSON file.
    """
    try:
        with open(filename, 'w') as f:
            json.dump(data_dict, f, indent=4)
        return f"Data saved to {filename}"
    except Exception as e:
        return f"Error saving to JSON: {str(e)}"


if __name__ == "__main__":
    #get the username of whoever is using this as a string
    User_Name = 'john_doe'

    
    # Meal Plan
    #print("Meal Plan:")
    meal_plan_text = create_meal_plan(User_Name)
    #print(meal_plan_text)
    meal_plan_dict = parse_meal_plan_to_dict(meal_plan_text)
    print("\nParsed Meal Plan:")
    print(json.dumps(meal_plan_dict, indent=4))
    meal_result = save_to_json(meal_plan_dict, "meal_plan.json")
    #print(meal_result)

    # Exercise Routine
    #print("\nExercise Routine:")
    exercise_routine_text = create_exercise_routine(User_Name)
    #print(exercise_routine_text)
    exercise_routine_dict = parse_exercise_routine_to_dict(exercise_routine_text)
    print("\nParsed Exercise Routine:")
    print(json.dumps(exercise_routine_dict, indent=4))
    exercise_result = save_to_json(exercise_routine_dict, "exercise_routine.json")
    #print(exercise_result)
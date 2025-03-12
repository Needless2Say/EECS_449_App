"""
Models For Calorie Tracker Website
"""
from sqlmodel import SQLModel, Field, Relationship, String, Column, ForeignKey, UniqueConstraint
from typing import Optional
# from sqlalchemy import Column, Integer, String, ForeignKey, Table
# from sqlalchemy.orm import relationship
# from .database import Base
import os
import re
import ollama
import requests
import json

# REMOVE API KEY BEFORE PUSHING TO GIT
API_KEY = ''
API_URL = 'https://openrouter.ai/api/v1/chat/completions'


# Define the headers for the API request
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

def create_meal_plan():
    # Define the request payload (data)
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{"role": "user", "content": "I am [college student looking to gain muscle]. Help me create a 7-day meal plan with breakfast, lunch, dinner. The meals should be balanced, nutritious, and aimed at a daily caloric intake of  at least 1600 calories. Make sure you return the output in this format: day_breakfast_lunch_dinner. For example: Monday_eggs with ham_grilled chicken with veggies_bowl of cereal. Notice that first we have the day, then a _ the breakfast, then a _ the lunch, and a _ and the dinner, only return this parsed output"}]
    } 
    # TODO : need to add the users data and preferences from the database
    # TODO : polish the prompt so it includes all info and does not suggest unhealthy habits

    # Send the POST request to the DeepSeek API
    response = requests.post(API_URL, json=data, headers=headers)

    response_json = response.json()
    assistant_content = response_json['choices'][0]['message']['content']
    return assistant_content

def create_exercise_routine():
    # Define the request payload (data)
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{
            "role": "user", 
            "content": "I am [college student looking to gain muscle]. Help me create a 7-day exercise routine plan. The exercises should be not super extreme. Make sure you return the output in this format: day_NumberOfSets_NumberOfReps_workoutName... For example: Monday_3_12_bicep curl_3_10_triceps extension_4_15_wrist curl. Notice that first we have the day, then a _ the Number of Sets (int), then a _ the Number of Sets (int), and a _ and the exercise name, also notice that one day can have many exercises (as many as you consider a complete routine) only return this parsed output"}]
    } # insert context in the []
    # TODO : need to add the users data and prefrences from the database

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
    # Meal Plan
    print("Meal Plan:")
    meal_plan_text = create_meal_plan()
    print(meal_plan_text)
    meal_plan_dict = parse_meal_plan_to_dict(meal_plan_text)
    print("\nParsed Meal Plan:")
    print(json.dumps(meal_plan_dict, indent=4))
    meal_result = save_to_json(meal_plan_dict, "meal_plan.json")
    print(meal_result)

    # Exercise Routine
    print("\nExercise Routine:")
    exercise_routine_text = create_exercise_routine()
    print(exercise_routine_text)
    exercise_routine_dict = parse_exercise_routine_to_dict(exercise_routine_text)
    print("\nParsed Exercise Routine:")
    print(json.dumps(exercise_routine_dict, indent=4))
    exercise_result = save_to_json(exercise_routine_dict, "exercise_routine.json")
    print(exercise_result)
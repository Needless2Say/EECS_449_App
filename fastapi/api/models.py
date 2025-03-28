"""
Models For Calorie Tracker Website
"""
from sqlmodel import SQLModel, Field, Relationship, String, Column, ForeignKey, UniqueConstraint, Session, select, delete, create_engine
from typing import Optional
from sqlalchemy.orm import attributes
import os
import re
import ollama
import requests
import json
from database import User
from dotenv import load_dotenv


engine = create_engine("sqlite:///orm.db")

load_dotenv()

# get API key and url from .env file
# API_KEY = os.getenv("API_KEY")
#API_URL = os.getenv("API_URL")
API_KEY = ''
API_URL = 'https://openrouter.ai/api/v1/chat/completions'


headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}


def extract_keywords_liked_meal(text: Optional[str], User_Name):
    """
    Extract keywords from a text string using the DeepSeek model.
    """
    if not text or not text.strip():
        return []

    
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{
            "role": "user",
            "content": (
                f"Extract the key words or phrases from the following text: '{text}'. "
                f"Focus on specific foods that they liked and adjectives describing the food. "
                f"Return the keywords as a comma-separated list, e.g., 'Indian, chicken, rice, easy'. "
                f"Only return the list, no extra text."
            )
        }]
    }

    response = requests.post(API_URL, json=data, headers=headers)
    response.raise_for_status()
    response_json = response.json()
    # print(json.dumps(response_json, indent=4))
        
    content = response_json['choices'][0]['message']['content'].strip()

    
    
    keywords = [k.strip() for k in content.split(",") if k.strip()]
    
    with Session(engine) as session:
        with session.begin():
            user = session.exec(select(User).where(User.username == User_Name)).first()
            if not user:
                return
            
            if user.liked_meals is None:
                user.liked_meals = []
            
            # Filter out duplicates and empty strings
            new_keywords = [k for k in keywords if k and k not in user.liked_meals]
            
            if not new_keywords:
                print("No new keywords to add")
                return []
            
            user.liked_meals.extend(new_keywords)
            
            attributes.flag_modified(user, "liked_meals")
            
            session.add(user)
            # No need to explicitly commit when using session.begin() context manager
        
        # Verify the changes were saved
        with Session(engine) as verify_session:
            updated_user = verify_session.get(User, user.id)
                


def extract_keywords_disliked_meal(text: Optional[str], User_Name):
    """
    Extract keywords from a text string using the DeepSeek model.
    """
    if not text or not text.strip():
        return []

    
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{
            "role": "user",
            "content": (
                f"Extract the key words or phrases from the following text: '{text}'. "
                f"Focus on specific foods that they disliked and adjectives describing the food. "
                f"Return the keywords as a comma-separated list, e.g., 'Indian, chicken, rice, easy'. "
                f"Only return the list, no extra text."
            )
        }]
    }
    
    response = requests.post(API_URL, json=data, headers=headers)
    response.raise_for_status()
    response_json = response.json()
    
    # print(json.dumps(response_json, indent=4))
    
    content = response_json['choices'][0]['message']['content'].strip()
    
    # Robust splitting that handles various comma formats
    keywords = [k.strip() for k in content.split(",") if k.strip()]
    
    with Session(engine) as session:
        with session.begin():
            user = session.exec(select(User).where(User.username == User_Name)).first()
            if not user:
                return
            
            # Initialize if None
            if user.disliked_meals is None:
                user.disliked_meals = []
            
            # Filter out duplicates and empty strings
            new_keywords = [k for k in keywords if k and k not in user.disliked_meals]
            
            if not new_keywords:
                print("No new keywords to add")
                return []
            
            user.disliked_meals.extend(new_keywords)
            
            attributes.flag_modified(user, "disliked_meals")
            
            session.add(user)
        
        with Session(engine) as verify_session:
            updated_user = verify_session.get(User, user.id)
            


def extract_keywords_liked_workout(text: Optional[str], User_Name: str):
    if not text or not text.strip():
        return []
    
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{
            "role": "user",
            "content": (
                f"Extract the key words or phrases from this workout review: '{text}'\n"
                f"Focus SPECIFICALLY on:\n"
                f"1. Exercises/types of workouts they enjoyed (e.g., 'deadlifts', 'yoga', 'HIIT')\n"
                f"2. Positive workout attributes (e.g., 'high intensity', 'low impact', 'challenging')\n"
                f"3. Liked equipment/facilities (e.g., 'kettlebells', 'outdoor track')\n"
                f"Return ONLY a comma-separated list like: 'deadlifts, high intensity, kettlebells, morning workouts'.\n"
                f"Exclude any negative comments or neutral descriptions.\n"
                f"Only return the list, no extra text."
            )
        }]
    }

    response = requests.post(API_URL, json=data, headers=headers)
    response.raise_for_status()
    response_json = response.json()
    content = response_json['choices'][0]['message']['content'].strip()
    
    keywords = [k.strip() for k in content.split(",") if k.strip()]
    
    with Session(engine) as session:
        with session.begin():
            user = session.exec(select(User).where(User.username == User_Name)).first()
            if not user:
                return
            
            #print(f"Found user: {user.username}")
            #print(f"Current liked_workouts: {user.liked_workouts}")
            
            if user.liked_workouts is None:
                user.liked_workouts = []
            
            new_keywords = [k for k in keywords if k and k not in user.liked_workouts]
            
            if not new_keywords:
                print("No new keywords to add")
                return []
            
            print(f"Adding new keywords: {new_keywords}")
            user.liked_workouts.extend(new_keywords)
            
            attributes.flag_modified(user, "liked_workouts")
            
            session.add(user)
        
        with Session(engine) as verify_session:
            updated_user = verify_session.get(User, user.id)
            #print(f"Verified liked_workouts: {updated_user.liked_workouts}")
            


def extract_keywords_disliked_workout(text: Optional[str], User_Name: str):
    if not text or not text.strip():
        return []
    
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{
            "role": "user",
            "content": (
                f"Extract the key words or phrases from this workout review: '{text}'\n"
                f"Focus SPECIFICALLY on:\n"
                f"1. Exercises/types of workouts they did not enjoy (e.g., 'deadlifts', 'yoga', 'HIIT')\n"
                f"2. Negative workout attributes (e.g., 'high intensity', 'low impact', 'difficult')\n"
                f"3. Disliked equipment/facilities (e.g., 'kettlebells', 'outdoor track')\n"
                f"Return ONLY a comma-separated list like: 'deadlifts, high intensity, kettlebells, morning workouts'.\n"
                f"Exclude any positive comments or neutral descriptions.\n"
                f"Only return the list, no extra text."
            )
        }]
    }

    response = requests.post(API_URL, json=data, headers=headers)
    response.raise_for_status()
    response_json = response.json()
    content = response_json['choices'][0]['message']['content'].strip()

    keywords = [k.strip() for k in content.split(",") if k.strip()]
    
    with Session(engine) as session:
        with session.begin():
            user = session.exec(select(User).where(User.username == User_Name)).first()
            if not user:
                return
            
            if user.disliked_workouts is None:
                user.disliked_workouts = []

            new_keywords = [k for k in keywords if k and k not in user.disliked_workouts]
            
            if not new_keywords:
                print("No new keywords to add")
                return []
            
            user.disliked_workouts.extend(new_keywords)
            attributes.flag_modified(user, "disliked_workouts")
            session.add(user)
        
        with Session(engine) as verify_session:
            updated_user = verify_session.get(User, user.id)
            


def create_meal_plan(User_Name):
    user_context = ''
    
    with Session(engine) as session:
        # query the user by ID
        statement = select(User).where(User.username == User_Name)
        user = session.exec(statement).first()

        #print(f'---------- {user.username} ---------')

        user_context = (
            f"{user.age}-year-old {user.gender if user.gender else 'person'} "
            f"weighing {user.weight_kg} kg and {user.height_cm} cm tall, "
            f"with {user.activity_level if user.activity_level else 'unspecified'} activity level, "
            f"aiming for {', '.join(goal for goal in user.fitness_goals)}, "
            f"following a {user.diet_preference if user.diet_preference else 'flexible'} diet, "
            f"liking foods such as {user.liked_meals if user.liked_meals else 'unspecified'}, "
            f"disliking foods such as {user.disliked_meals if user.disliked_meals else 'unspecified'}, "
            f"alergic to (DO NOT INCLUDE THESE FOODS) {user.allergies if user.allergies else 'no specific allergies'}, "
        )

        #print(f'TEST on {user.first_name}: {user.liked_meals}')
        #print(user_context)

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

        # send the POST request to the DeepSeek API
        response = requests.post(API_URL, json=data, headers=headers)
        response_json = response.json()
        assistant_content = response_json['choices'][0]['message']['content']
        return assistant_content


def create_exercise_routine(User_Name):
    user_context = ''
    
    with Session(engine) as session:
        statement = select(User).where(User.username == User_Name)
        user = session.exec(statement).first()
        #print(f'---------- {user.username} ---------')

        user_context = (
            f"{user.age}-year-old {user.gender if user.gender else 'person'} "
            f"weighing {user.weight_kg} kg and {user.height_cm} cm tall, "
            f"with {user.activity_level if user.activity_level else 'unspecified'} activity level, "
            f"aiming for {', '.join(goal for goal in user.fitness_goals)}, "
            f"preferring {', '.join(str(pref) for pref in user.exercise_preferences)} exercises, "
            f"liking exercises such as {', '.join(like for like in user.liked_workouts)}, "
            f"disliking exercises such as {', '.join(dislike for dislike in user.disliked_workouts)}, "
            f"and available to exercise {', '.join(str(day) for day in user.exercise_availability)}, "
        )

        #print(f'TEST extracted liked workouts of {user.first_name}: {user.liked_workouts}')
        #print(user_context)

        data = {
            "model": "deepseek/deepseek-chat:free",
            "messages": [{
                "role": "user",
                "content": (
                    f"I am [{user_context}]. Help me create a exercise routine plan. "
                    f"Only include workouts for days that I am available to exercise. "
                    f"The exercises should be not super extreme and supportive of my goals. "
                    f"The workout plan per day should last no more than one hour. "
                    f"Return the output in this format: _day_NumberOfSets_NumberOfReps_workoutName... "
                    f"For example: _Monday_3_12_bicep curl_3_10_triceps extension_4_15_wrist curl_Wednesday..."
                    f"Notice that first we have a _, then the day (string), then a _ the Number of Sets, then a _ the Number of Reps, "
                    f"and a _ and the exercise name, also notice that one day can have many exercises, "
                    f"only return this parsed output, no extra text."
                )
            }]
        }
        
        # send the POST request to the DeepSeek API
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
    Each line should represent a separate day's workout in the format:
    dayName_sets_reps_exerciseName_sets_reps_exerciseName...
    """
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    cleaned_str = exercise_routine_text.replace('\n', ' ').strip()
    parts = cleaned_str.split('_')
    result = {}
    current_day = None
    i = 0

    while i < len(parts):
        if parts[i] in days:
            current_day = parts[i]
            result[current_day] = []
            i += 1
        elif current_day:
            try:
                sets = int(parts[i])
                reps = int(parts[i+1])
                exercise = parts[i+2]
                result[current_day].append({
                    "sets": sets,
                    "reps": reps,
                    "exercise": exercise
                })
                i += 3
            except (IndexError, ValueError):
                break  # Skip incomplete/malformed entries
        else:
            i += 1  # Skip parts before the first day
    return result  # Returns a Python dictionary


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
    # Get the username
    User_Name = 'john_doe'

    ############ preferences keyword extraction testing #############

    liked_food_review = 'I really liked that you included Indian cuisine and that the recipes were very easy to make'
    extract_keywords_liked_meal(liked_food_review, User_Name)
    
    disliked_food_review = 'I disliked that you included Italian cuisine and that the recipes were very difficult to make'
    extract_keywords_disliked_meal(disliked_food_review, User_Name)
    
    liked_exercise_review = 'I really liked that you included arm workouts with dumbells'
    extract_keywords_liked_workout(liked_exercise_review, User_Name)
    
    disliked_exercise_review = "I disliked the cardio portion of the workout. I really don't like running because of the stress on my joints"
    extract_keywords_disliked_workout(disliked_exercise_review, User_Name)
    
    
    ############# CREATE PLANS #############
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
    # print(exercise_routine_text)
    exercise_routine_dict = parse_exercise_routine_to_dict(exercise_routine_text)
    print("\nParsed Exercise Routine:")
    print(json.dumps(exercise_routine_dict, indent=4))
    exercise_result = save_to_json(exercise_routine_dict, "exercise_routine.json")
    #print(exercise_result)

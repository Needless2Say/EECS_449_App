import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Update if different in production

/**
    * Retrieves the user's meal plan from the backend.
    * @param token The user's authentication token.
    * @returns A promise that resolves to the meal plan data.
*/
export const getMealPlan = async (token: string): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/user/meal-plan`, {
    headers: { Authorization: `Bearer ${token}` },
});
    return response.data.meal_plan;
};

/**
    * Retrieves the user's workout plan from the backend.
    * @param token The user's authentication token.
    * @returns A promise that resolves to the workout plan data.
*/
export const getWorkoutPlan = async (token: string): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/user/workout-plan`, {
    headers: { Authorization: `Bearer ${token}` },
});
    return response.data.workout_plan;
};

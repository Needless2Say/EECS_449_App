"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AuthContext from "../context/AuthContext";

// Define the type for one day's meal plan.
export interface DayMealPlan {
    breakfast: string;
    lunch: string;
    dinner: string;
}
  
// Define the type for the full week's meal plan.
export interface MealPlan {
    Monday: DayMealPlan;
    Tuesday: DayMealPlan;
    Wednesday: DayMealPlan;
    Thursday: DayMealPlan;
    Friday: DayMealPlan;
    Saturday: DayMealPlan;
    Sunday: DayMealPlan;
}

const MealPlanPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMealPlan = async () => {
            try {
                // const token = localStorage.getItem("token");
                console.log("FETCHING MEAL PLAN");

                const response = await axios.get(
                    "http://localhost:8000/user/meal-plan",
                    { headers: { Authorization: `Bearer ${auth.user?.access_token}` } }
                );
                console.log("GOT MEAL PLAN");

                // Assume the response structure is { meal_plan: { ... } }
                console.log(response.data);
                setMealPlan(response.data.meal_plan);

            } catch (error) {
                console.error("Error fetching meal plan", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlan();
    }, [auth]);

    // Convert the mealPlan object into an array of [day, meals] entries.
    const entries = mealPlan ? Object.entries(mealPlan) : [];

    return (
        <div className="min-h-screen bg-gray-100 p-4 text-black">
            {/* Header: Home Button and Page Title */}
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute left-0">
                    <Link href="/" className="text-blue-600 hover:underline font-semibold">
                        Home
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-center">Meal Plan</h1>
            </div>

            {loading ? (
                <p>Loading meal plan...</p>
            ) : mealPlan ? (
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
                    {entries.map(([day, meals]) => (
                        <div key={day} className="bg-white rounded shadow p-4">
                            <h2 className="font-semibold text-lg mb-2">{day}</h2>
                            <ul className="text-sm space-y-1">
                                <li>
                                    <strong>Breakfast:</strong> {meals.breakfast}
                                </li>
                                <li>
                                    <strong>Lunch:</strong> {meals.lunch}
                                </li>
                                <li>
                                    <strong>Dinner:</strong> {meals.dinner}
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No meal plan available.</p>
            )}
        </div>
    );
};

export default MealPlanPage;

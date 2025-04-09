"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AuthContext from "../context/AuthContext";

// Define an interface for a single workout item.
export interface WorkoutItem {
    sets: number;
    reps: number;
    exercise: string;
}
  
// Define an interface for the weekly workout plan.
export interface WorkoutPlan {
    Monday: WorkoutItem[];
    Tuesday: WorkoutItem[];
    Wednesday: WorkoutItem[];
    Thursday: WorkoutItem[];
    Friday: WorkoutItem[];
    Saturday: WorkoutItem[];
    Sunday: WorkoutItem[];
}

const WorkoutPlanPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutPlan = async () => {
            // const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    "http://localhost:8000/user/workout-plan",
                    { headers: { Authorization: `Bearer ${auth.user?.access_token}` } }
                );

                // Assume backend returns { workout_plan: { ... } }
                console.log(response.data);
                setWorkoutPlan(response.data.workout_plan);

            } catch (error) {
                console.error("Error fetching workout plan", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutPlan();
    }, [auth]);

    // Convert the workoutPlan object into an array of [day, exercises] entries.
    const entries = workoutPlan ? Object.entries(workoutPlan) : [];

    return (
        <div className="min-h-screen bg-gray-100 p-4 text-black">
            {/* Header: Home Button and Page Title */}
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute left-0">
                    <Link href="/" className="text-blue-600 hover:underline font-semibold">
                        Home
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-center">Workout Plan</h1>
            </div>

            {loading ? (
                <p>Loading workout plan...</p>
            ) : workoutPlan ? (
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
                    {entries.map(([day, exercises]) => (
                        <div key={day} className="bg-white rounded shadow p-4">
                            <h2 className="font-semibold text-lg mb-2">{day}</h2>
                            {(exercises as WorkoutItem[]).map((item, index) => (
                                <div key={index} className="mb-2 text-sm">
                                    {item.sets} sets x {item.reps} reps - {item.exercise}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No workout plan available.</p>
            )}
        </div>
    );
};

export default WorkoutPlanPage;

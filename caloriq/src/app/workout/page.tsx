"use client";

import React from "react";
import Link from "next/link";


// mock data for demonstration (replace with real data from your backend)
const workoutData = {
    Monday: [
        { sets: 3, reps: 12, exercise: "push-up" },
        { sets: 3, reps: 10, exercise: "dumbbell bench press" },
        { sets: 3, reps: 12, exercise: "dumbbell fly" },
        { sets: 3, reps: 15, exercise: "plank" },
    ],
    Tuesday: [
        { sets: 3, reps: 12, exercise: "bodyweight squat" },
        { sets: 3, reps: 10, exercise: "dumbbell lunges" },
        { sets: 3, reps: 12, exercise: "glute bridge" },
        { sets: 3, reps: 15, exercise: "side plank" },
    ],
    Wednesday: [
        { sets: 3, reps: 12, exercise: "bent-over dumbbell row" },
        { sets: 3, reps: 10, exercise: "lat pulldown" },
        { sets: 3, reps: 12, exercise: "dumbbell bicep curl" },
        { sets: 3, reps: 15, exercise: "wrist curl" },
    ],
    Thursday: [
        { sets: 3, reps: 12, exercise: "push-up" },
        { sets: 3, reps: 10, exercise: "dumbbell shoulder press" },
        { sets: 3, reps: 12, exercise: "lateral raise" },
        { sets: 3, reps: 15, exercise: "plank" },
    ],
    Friday: [
        { sets: 3, reps: 12, exercise: "bodyweight squat" },
        { sets: 3, reps: 10, exercise: "dumbbell deadlift" },
        { sets: 3, reps: 12, exercise: "step-up" },
        { sets: 3, reps: 15, exercise: "side plank" },
    ],
    Saturday: [
        { sets: 3, reps: 12, exercise: "bent-over dumbbell row" },
        { sets: 3, reps: 10, exercise: "dumbbell triceps extension" },
        { sets: 3, reps: 12, exercise: "dumbbell hammer curl" },
        { sets: 3, reps: 15, exercise: "wrist curl" },
    ],
    Sunday: [
        { sets: 3, reps: 12, exercise: "push-up" },
        { sets: 3, reps: 10, exercise: "dumbbell bench press" },
        { sets: 3, reps: 12, exercise: "dumbbell fly" },
        { sets: 3, reps: 15, exercise: "plank" },
    ],
};


const WorkoutPlanPage: React.FC = () => {
    // convert the object into an array of [day, exercises]
    const entries = Object.entries(workoutData); // e.g. [["Monday", [ {sets:3, reps:12, exercise:"push-up"}, ... ]], ...]

    return (
        <div className="min-h-screen bg-gray-100 p-4 text-black">
            {/* Home Button + Page Title */}
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute left-0">
                    <Link href="/" className="text-blue-600 hover:underline font-semibold">
                        Home
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-center">Workout Plan</h1>
            </div>

            {/* Responsive grid: 1 column on small screens, 7 columns on medium+ */}
            <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
                {entries.map(([day, exercises]) => (
                    <div key={day} className="bg-white rounded shadow p-4">
                        <h2 className="font-semibold text-lg mb-2">{day}</h2>
                        {/* @ts-ignore */}
                        {exercises.map((item, index) => (
                            <div key={index} className="mb-2 text-sm">
                                {item.sets} sets x {item.reps} reps - {item.exercise}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutPlanPage;

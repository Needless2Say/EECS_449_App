"use client";

import React from "react";
import Link from "next/link";


// mock data for demonstration (replace with real data from your backend)
const mealPlanData = {
    Monday: {
        breakfast: "peanut butter toast with banana",
        lunch: "grilled chicken salad with quinoa",
        dinner: "baked salmon with sweet potato and broccoli",
    },
    Tuesday: {
        breakfast: "greek yogurt with granola and berries",
        lunch: "turkey and avocado wrap",
        dinner: "grilled steak with asparagus and brown rice",
    },
    Wednesday: {
        breakfast: "oatmeal with almond butter and apple",
        lunch: "chickpea and spinach curry",
        dinner: "grilled shrimp with zucchini noodles and pesto",
    },
    Thursday: {
        breakfast: "scrambled eggs with spinach and whole grain toast",
        lunch: "lentil soup with whole grain bread",
        dinner: "roast chicken with roasted carrots and quinoa",
    },
    Friday: {
        breakfast: "protein smoothie with spinach, banana, and almond milk",
        lunch: "grilled chicken with mixed greens and olive oil dressing",
        dinner: "baked cod with mashed cauliflower and green beans",
    },
    Saturday: {
        breakfast: "whole grain pancakes with honey and walnuts",
        lunch: "tuna salad with mixed veggies",
        dinner: "grilled lamb chops with couscous and steamed broccoli",
    },
    Sunday: {
        breakfast: "avocado and egg on whole grain toast",
        lunch: "beef and vegetable stir-fry with rice",
        dinner: "grilled turkey breast with roasted sweet potatoes and Brussels sprouts",
    },
};


const MealPlanPage: React.FC = () => {
    // convert the object into an array of [day, meals]
    const entries = Object.entries(mealPlanData); // e.g. [["Monday", {breakfast: "X", lunch: "Y", dinner: "Z"}], ...]

    return (
        <div className="min-h-screen bg-gray-100 p-4 text-black">
            {/* Home Button + Page Title */}
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute left-0">
                    <Link href="/" className="text-blue-600 hover:underline font-semibold">
                        Home
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-center">Meal Plan</h1>
            </div>

            {/* Responsive grid: 1 column on small screens, 7 columns on medium+ */}
            <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
                {entries.map(([day, meals]) => (
                    <div key={day} className="bg-white rounded shadow p-4">
                        <h2 className="font-semibold text-lg mb-2">{day}</h2>
                        {/* @ts-ignore */}
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
        </div>
    );
};

export default MealPlanPage;

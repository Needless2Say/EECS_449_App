"use client";

import React, { createContext, useState, ReactNode } from "react";


interface PlanContextType {
    mealPlan: any | null;
    setMealPlan: (plan: any) => void;
    workoutPlan: any | null;
    setWorkoutPlan: (plan: any) => void;
}


export const PlanContext = createContext<PlanContextType | undefined>(undefined);


export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mealPlan, setMealPlan] = useState<any | null>(null);
    const [workoutPlan, setWorkoutPlan] = useState<any | null>(null);

    return (
        <PlanContext.Provider value={{ mealPlan, setMealPlan, workoutPlan, setWorkoutPlan }}>
            {children}
        </PlanContext.Provider>
    );
};

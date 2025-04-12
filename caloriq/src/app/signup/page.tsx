"use client";

import React, { useContext, useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { PlanContext } from "../context/PlanContext";


const SignUpPage: React.FC = () => {
    // create authentication variable by getting return value from custom context AuthContext
    const auth = useContext(AuthContext);

    // create meal and workout plan context variables by getting return value from custom context PlanContext
    const { setMealPlan, setWorkoutPlan } = useContext(PlanContext)!;

    // initialize router for redirecting or routing user to different pages
    const router = useRouter();

    // state to toggle survey display state
    const [showSurvey, setShowSurvey] = useState(false);

    // loading state for overlay
    const [loading, setLoading] = useState(false);

    // signup form states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    // survey form states
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [dietPreference, setDietPreference] = useState("");
    const [allergies, setAllergies] = useState("");
    const [exercisePreference, setExercisePreference] = useState<string[]>([]);
    const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
    const [mealPrepAvailability, setMealPrepAvailability] = useState<string[]>([]);
    const [exerciseAvailability, setExerciseAvailability] = useState<string[]>([]);

    // check if auth is available
    if (!auth) {
        throw new Error("AuthContext is not available! Did you forget to wrap <AuthProvider>?");
    }
    // const { login } = auth;

    // function to register new user
    const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        console.log({ username, password, email });
        setShowSurvey(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/auth/register",
                { username, password, email },
                { headers: { "Content-Type": "application/json" } }
            );

            // login user after successful registration
            await auth.login(username, password);
            setShowSurvey(true);

        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    // function to submit survey answers and generate plans
    const handleSurveySubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // process allergies input into a formatted comma-separated string
        const allergyArray = allergies
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        console.log({
            age,
            height,
            weight,
            gender,
            activityLevel,
            dietPreference,
            allergies: allergyArray,
            exercisePreference,
            fitnessGoals,
            mealPrepAvailability,
            exerciseAvailability,
        });

        try {
            // send survey answers to backend
            await axios.post(
                "http://localhost:8000/user/preferences",
                {
                    age,
                    height,
                    weight,
                    gender,
                    activityLevel,
                    dietPreference,
                    allergies: allergyArray,
                    exercisePreference,
                    fitnessGoals,
                    mealPrepAvailability,
                    exerciseAvailability,
                },
                { headers: { Authorization: `Bearer ${auth.user?.access_token}` } }
            );

            // set loading state to show overlay
            setLoading(true);

            // fire both the meal and workout plan API requests in parallel
            const [meal_response, workout_response] = await Promise.all([
                axios.post(
                    "http://localhost:8000/user/meals",
                    { headers: { Authorization: `Bearer ${auth.user?.access_token}` } }
                ),
                axios.post(
                    "http://localhost:8000/user/workouts",
                    { headers: { Authorization: `Bearer ${auth.user?.access_token}` } }
                ),
            ]);

            // log meal and workout responses to console
            console.log(meal_response.data);
            console.log(workout_response.data);

            // save meal and workout plans to PlanContext
            setMealPlan(meal_response.data.meal_plan);
            setWorkoutPlan(workout_response.data.excercise_plan);

            // redirect the user to the home page after responses are received
            router.push("/");

        } catch (error) {
            console.error("Survey submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // profile menu state and reference for clicking outside
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };

        if (profileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, [profileMenuOpen]);

    const handleLogin = () => {
        setProfileMenuOpen(false);
        router.push("/login");
    };

    const handleLogout = () => {
        console.log("Logging out...");
        // Insert logout logic here
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-black relative">
            {!showSurvey ? (
                <>
                    {/* Sign Up Form */}
                    <div className="w-full max-w-md bg-white rounded shadow p-6">
                        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                        <form onSubmit={handleRegister}>
                            {/* Username Field */}
                            <label htmlFor="username" className="block mb-1 font-medium">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username..."
                                className="border rounded w-full p-2 mb-4"
                                required
                            />

                            {/* Password Field */}
                            <label htmlFor="password" className="block mb-1 font-medium">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password..."
                                className="border rounded w-full p-2 mb-4"
                                required
                            />

                            {/* Email Field */}
                            <label htmlFor="email" className="block mb-1 font-medium">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email..."
                                className="border rounded w-full p-2 mb-4"
                                required
                            />

                            {/* Create Account Button */}
                            <button
                                type="submit"
                                className="bg-blue-600 text-white w-full p-2 rounded mb-6 hover:bg-blue-700 text-lg"
                            >
                                Create Account
                            </button>

                            {/* Sign Up Link */}
                            <p className="text-m text-center">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-600 underline">
                                Login
                                </Link>
                            </p>
                        </form>
                    </div>

                    {/* Horizontal Divider */}
                    <hr className="w-full max-w-md my-6 border-t-2 border-black" />

                    {/* Lower Section: Social Logins */}
                    <div className="w-full max-w-md bg-white rounded shadow p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Login / Create Account
                        </h3>
                        <button className="border rounded w-full p-2 mb-2 flex items-center justify-center hover:bg-gray-100">
                            <Image
                                src="/google-icon.png"
                                alt="Google"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Continue with Google
                        </button>
                        <button className="border rounded w-full p-2 mb-2 flex items-center justify-center hover:bg-gray-100">
                            <Image
                                src="/facebook-icon.png"
                                alt="Facebook"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Continue with Facebook
                        </button>
                        <button className="border rounded w-full p-2 mb-2 flex items-center justify-center hover:bg-gray-100">
                            <Image
                                src="/github-icon.png"
                                alt="GitHub"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Continue with GitHub
                        </button>
                    </div>
                </>
            ) : (
                /* Survey Form */
                <div className="w-full max-w-md bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        User Preferences Survey
                    </h2>
                    <form onSubmit={handleSurveySubmit}>
                        <label htmlFor="age" className="block mb-1 font-medium">
                            Age (Optional)
                        </label>
                        <input
                            id="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Age..."
                            className="border rounded w-full p-2 mb-4"
                        />

                        <label htmlFor="height" className="block mb-1 font-medium">
                            Height (Optional)
                        </label>
                        <input
                            id="height"
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Height..."
                            className="border rounded w-full p-2 mb-4"
                        />

                        <label htmlFor="weight" className="block mb-1 font-medium">
                            Weight (Optional)
                        </label>
                        <input
                            id="weight"
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Weight..."
                            className="border rounded w-full p-2 mb-4"
                        />

                        <label htmlFor="gender" className="block mb-1 font-medium">
                            Gender (Optional)
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="border rounded w-full p-2 mb-4"
                        >
                            <option value="">Select One...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>

                        <label htmlFor="activityLevel" className="block mb-1 font-medium">
                            Activity Level (Optional)
                        </label>
                        <select
                            id="activityLevel"
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(e.target.value)}
                            className="border rounded w-full p-2 mb-4"
                        >
                            <option value="">Select One...</option>
                            <option value="Sedentary">Sedentary</option>
                            <option value="Lightly Active">Lightly Active</option>
                            <option value="Moderately Active">Moderately Active</option>
                            <option value="Very Active">Very Active</option>
                        </select>

                        <label htmlFor="dietPreference" className="block mb-1 font-medium">
                            Diet Preference (Optional)
                        </label>
                        <select
                            id="dietPreference"
                            value={dietPreference}
                            onChange={(e) => setDietPreference(e.target.value)}
                            className="border rounded w-full p-2 mb-4"
                        >
                            <option value="">Select One...</option>
                            <option value="Carnivore">Carnivore</option>
                            <option value="Omnivore">Omnivore</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Keto">Keto</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Other">Other</option>
                        </select>

                        <label htmlFor="allergies" className="block mb-1 font-medium">
                            Allergies (Optional)
                        </label>
                        <input
                            id="allergies"
                            type="text"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            onBlur={(e) => {
                                const processed = e.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter((item) => item.length > 0)
                                .join(", ");
                                setAllergies(processed);
                            }}
                            placeholder="e.g. peanuts, gluten, dairy..."
                            className="border rounded w-full p-2 mb-4"
                        />

                        <label htmlFor="exercisePreference" className="block mb-1 font-medium">
                            Exercise Preference (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Cardio",
                                "Strength Training",
                                "Flexibility & Mobility",
                                "High-Intensity Interval Training (HIIT)",
                            ].map((goal) => (
                                <label
                                key={goal}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                <input
                                    type="checkbox"
                                    value={goal}
                                    checked={exercisePreference.includes(goal)}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    setExercisePreference((prev) =>
                                        prev.includes(value)
                                        ? prev.filter((item) => item !== value)
                                        : [...prev, value]
                                    );
                                    }}
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                                <span className="text-gray-700">{goal}</span>
                                </label>
                            ))}
                        </div>

                        <label htmlFor="fitnessGoals" className="block mb-1 font-medium">
                            Fitness Goals (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Weight Loss",
                                "Gain Muscle",
                                "Increase Endurance",
                                "Improve Flexibility",
                                "General Fitness",
                                "Sports Performance",
                                "Maintain Weight",
                            ].map((goal) => (
                                <label
                                    key={goal}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={goal}
                                        checked={fitnessGoals.includes(goal)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFitnessGoals(prev => 
                                                prev.includes(value)
                                                    ? prev.filter(item => item !== value) // Remove if exists
                                                    : [...prev, value] // Add if new
                                            );
                                        }}
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                    <span className="text-gray-700">{goal}</span>
                                </label>
                            ))}
                        </div>

                        <label htmlFor="mealPrepAvailability" className="block mb-1 font-medium">
                            Meal Prep Availability (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                            ].map((day) => (
                                <label
                                key={day}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                <input
                                    type="checkbox"
                                    value={day}
                                    checked={mealPrepAvailability.includes(day)}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    setMealPrepAvailability((prev) =>
                                        prev.includes(value)
                                        ? prev.filter((item) => item !== value)
                                        : [...prev, value]
                                    );
                                    }}
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                                <span className="text-gray-700">{day}</span>
                                </label>
                            ))}
                        </div>

                        <label htmlFor="exerciseAvailability" className="block mb-1 font-medium">
                            Exercise Availability (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                            ].map((day) => (
                                <label
                                key={day}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                <input
                                    type="checkbox"
                                    value={day}
                                    checked={exerciseAvailability.includes(day)}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    setExerciseAvailability((prev) =>
                                        prev.includes(value)
                                        ? prev.filter((item) => item !== value)
                                        : [...prev, value]
                                    );
                                    }}
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                                <span className="text-gray-700">{day}</span>
                                </label>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 text-lg"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <p className="text-white mb-4 text-lg">Loading Your Meal And Workout Plan</p>
                    <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default SignUpPage;

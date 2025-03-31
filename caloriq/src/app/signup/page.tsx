"use client";

import React, { useContext, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";


const SignUpPage: React.FC = () => {
    // create authentication variable by getting return value from custom context AuthContext
    const auth = useContext(AuthContext);

    // initialize router for redirecting or routing user to different pages
    const router = useRouter();

    // state to toggle survey display state
    const [showSurvey, setShowSurvey] = useState(false);

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


    // check if auth is a valid variable
    if (!auth) {
        throw new Error("AuthContext is not available! Did you forget to wrap <AuthProvider>?");
    }


    // function to register new user
    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        console.log({
            "username": username,
            "password": password,
            "email": email
        });

        setShowSurvey(true);

        // try following lines of code
        // try {
        //     await axios.post("http://localhost:8000/auth/register", {
        //         username,
        //         password,
        //         email
        //     });

        //     // login user after successful registration
        //     await auth.login(username, password);
            
        //     // show survey after successful registration/login
        //     setShowSurvey(true);
        // } catch (error) {
        //     console.error("Registration failed:", error);
        // }
    };


    // function to send survey answers to backend
    const handleSurveySubmit = async (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        const allergyArray = allergies
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        console.log({
            "age": age,
            "height": height,
            "weight": weight,
            "gender": gender,
            "activity level": activityLevel,
            "diet preference": dietPreference,
            "allergies": allergyArray,
            "exercise preference": exercisePreference,
            "fitness goals": fitnessGoals,
            "meal prep availability": mealPrepAvailability,
            "exercise availability": exerciseAvailability
        })

        // try following lines of code
        // try {
        //     // construct array of allergies from user
        //     const allergyArray = allergies
        //         .split(',')
        //         .map(item => item.trim())
        //         .filter(item => item.length > 0);

        //     // send user preferences to backend to be processed
        //     await axios.post(
        //         "http://localhost:8000/user/preferences",
        //         { age, height, weight, gender, activityLevel, dietPreference, allergyArray, exercisePreference, fitnessGoals, mealPrepAvailability, exerciseAvailability }, // survey items
        //         { headers: { Authorization: `Bearer ${auth.user?.access_token}` } } // authorization for backend
        //     );
            
        //     // redirect user to home page after submitting survey
        //     router.push("/");
        // } catch (error) { // catch all errors
        //     // send error to console
        //     console.error("Survey submission failed:", error);
        // }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-black">
            {!showSurvey ? (
                // Sign Up Form
                <>
                    <div className="w-full max-w-md bg-white rounded shadow p-6">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Sign Up
                        </h2>

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

                            {/* Create Account Button - changed to type="submit" */}
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


                    {/* Lower Section: Create Account (Social Logins) */}
                    <div className="w-full max-w-md bg-white rounded shadow p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Login / Create Account
                        </h3>

                        {/* Google Auth Button */}
                        <button className="border rounded w-full p-2 mb-2 flex items-center justify-center hover:bg-gray-100">
                            {/* 
                                Replace /google-icon.png with your actual Google icon.
                                If you have it in /public, you can reference it directly.
                            */}
                            <Image
                                src="/google_icon.png"
                                alt="Google"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                                Continue with Google
                        </button>

                        {/* Facebook Auth Button */}
                        <button className="border rounded w-full p-2 mb-2 flex items-center justify-center hover:bg-gray-100">
                            {/* Replace /facebook-icon.png with your actual Facebook icon. */}
                            <Image
                                src="/facebook_icon.png"
                                alt="Facebook"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                                Continue with Facebook
                        </button>

                        {/* GitHub Auth Button */}
                        <button className="border rounded w-full p-2 mb-2 flex items-center justify-center hover:bg-gray-100">
                            {/* Replace /facebook-icon.png with your actual Facebook icon. */}
                            <Image
                                src="/github_icon.png"
                                alt="GitHub"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                                Continue with GitHub
                        </button>

                        {/* Add other social auth providers below, e.g. Apple, Twitter, GitHub, etc. */}


                    </div>
                </>
                
            ) : (
                /* Survey Form */
                <div className="w-full max-w-md bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        User Preferences Survey
                    </h2>

                    <form onSubmit={handleSurveySubmit}>
                        {/* Age (Optional) */}
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

                        {/* Height (Optional) */}
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

                        {/* Weight (Optional) */}
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

                        {/* Gender (Optional) */}
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
                            <option value="Non-Binary">Non-Binary</option>
                            <option value="Prefer Not to Say">Prefer Not to Say</option>
                        </select>

                        {/* Activity Level (Optional) */}
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
                            <option value="Light">Light</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Active">Active</option>
                            <option value="Very Active">Very Active</option>
                        </select>

                        {/* Diet Preference (Optional) - changed to SELECT */}
                        <label htmlFor="dietpreference" className="block mb-1 font-medium">
                            Diet Preference (Optional)
                        </label>
                        <select
                            id="dietpreference"
                            value={activityLevel}
                            onChange={(e) => setDietPreference(e.target.value)}
                            className="border rounded w-full p-2 mb-4"
                        >
                            <option value="">Select One...</option>
                        </select>

                        {/* Allergies (Optional) */}
                        <label htmlFor="allergies" className="block mb-1 font-medium">
                            Allergies (Optional)
                        </label>
                        <input
                            id="allergies"
                            type="text"
                            value={allergies}
                            onChange={(e) => {
                                // store raw input value
                                setAllergies(e.target.value);
                            }}
                            onBlur={(e) => {
                                // process and format on blur
                                const processed = e.target.value
                                    .split(',')
                                    .map(item => item.trim())
                                    .filter(item => item.length > 0)
                                    .join(', ');
                                setAllergies(processed);
                            }}
                            placeholder="e.g. peanuts, gluten, dairy..."
                            className="border rounded w-full p-2 mb-4"
                        />

                        {/* Exercise Preference (Optional) - changed to SELECT */}
                        <label htmlFor="exercisepreferences" className="block mb-1 font-medium">
                            Exercise Preference (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Choose 1",
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
                                            setExercisePreference(prev => 
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

                        {/* Fitness Goals (Optional) - changed to SELECT */}
                        <label htmlFor="fitnessGoals" className="block mb-1 font-medium">
                            Fitness Goals (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Lose Weight",
                                "Build Muscle",
                                "Increase Endurance",
                                "Maintain Fitness",
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

                        {/* Meal Prep Availability (Optional) - changed to SELECT */}
                        <label htmlFor="mealprepavailability" className="block mb-1 font-medium">
                            Meal Prep Availability (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Monday Morning",
                                "Monday Afternoon",
                                "Monday Evening",
                                "Tuesday Morning",
                                "Tuesday Afternoon",
                                "Tuesday Evening",
                                "Wednesday Morning",
                                "Wednesday Afternoon",
                                "Wednesday Evening",
                                "Thursday Morning",
                                "Thursday Afternoon",
                                "Thursday Evening",
                                "Friday Morning",
                                "Friday Afternoon",
                                "Friday Evening",
                                "Saturday Morning",
                                "Saturday Afternoon",
                                "Saturday Evening",
                                "Sunday Morning",
                                "Sunday Afternoon",
                                "Sunday Evening",
                            ].map((goal) => (
                                <label
                                    key={goal}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={goal}
                                        checked={mealPrepAvailability.includes(goal)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setMealPrepAvailability(prev => 
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

                        {/* Exercise Availability (Optional) - changed to SELECT */}
                        <label htmlFor="exerciseavailability" className="block mb-1 font-medium">
                            Exercise Availability (Optional) - Select Multiple
                        </label>
                        <div className="border rounded w-full p-2 mb-4 space-y-2">
                            {[
                                "Monday Morning",
                                "Monday Afternoon",
                                "Monday Evening",
                                "Tuesday Morning",
                                "Tuesday Afternoon",
                                "Tuesday Evening",
                                "Wednesday Morning",
                                "Wednesday Afternoon",
                                "Wednesday Evening",
                                "Thursday Morning",
                                "Thursday Afternoon",
                                "Thursday Evening",
                                "Friday Morning",
                                "Friday Afternoon",
                                "Friday Evening",
                                "Saturday Morning",
                                "Saturday Afternoon",
                                "Saturday Evening",
                                "Sunday Morning",
                                "Sunday Afternoon",
                                "Sunday Evening",
                            ].map((goal) => (
                                <label
                                    key={goal}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={goal}
                                        checked={exerciseAvailability.includes(goal)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setExerciseAvailability(prev => 
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 text-lg"
                            onClick={() => handleSurveySubmit}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SignUpPage;
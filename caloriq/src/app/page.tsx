"use client";

import React, { useContext, useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import AuthContext from "./context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

// define a chat message interface
interface ChatMessage {
    sender: "user" | "model";
    text: string;
}

interface FeedbackData {
    workout: {
        liked: string[];
        disliked: string[];
        newPlan: boolean;
    };
    meals: {
        liked: string[];
        disliked: string[];
        newPlan: boolean;
    };
}


const HomePage: React.FC = () => {
    // create authentication variable by getting return value from custom context AuthContext
    const auth = useContext(AuthContext);

    // initialize router for redirecting or routing user to different pages
    const router = useRouter();

    // initialize toggles for sidebar and profile menu pop up
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // state for chat input and chat logs
    const [chatMessage, setChatMessage] = useState("");
    const [chatLogs, setChatLogs] = useState<ChatMessage[]>([]);

    // reference for profile menu (for click outside behavior)
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // toggle handlers for sidebar and profile menu
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

    // states for weekly feedback survey
    const [showSurveyPrompt, setShowSurveyPrompt] = useState(false);
    const [showSurvey, setShowSurvey] = useState(true);
    const [feedbackData, setFeedbackData] = useState<FeedbackData>({
        workout: { liked: [], disliked: [], newPlan: false },
        meals: { liked: [], disliked: [], newPlan: false }
    });
    const [inputText, setInputText] = useState({
        workoutLiked: "",
        workoutDisliked: "",
        mealsLiked: "",
        mealsDisliked: ""
    });

    // loading state for overlay
    const [loading, setLoading] = useState(false);



    // function to parse comma-separated input into an array of strings
    const parseCommaSeparatedInput = (input: string): string[] =>
        input
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);    


    // useEffect to show survey prompt every Monday
    useEffect(() => {
        if (auth?.user) {
            const lastPrompt = localStorage.getItem('lastSurveyPrompt');
            const now = new Date();
            const lastPromptDate = lastPrompt ? new Date(lastPrompt) : null;
            
            // check if it's Monday and survey hasn't been shown this week
            if (now.getDay() === 1 && (!lastPromptDate || 
                now.getTime() - lastPromptDate.getTime() > 7 * 24 * 60 * 60 * 1000)) {
                setShowSurveyPrompt(true);
                localStorage.setItem('lastSurveyPrompt', now.toISOString());
            }
        }
    }, [auth?.user]);


    // function to handle survey response (yes or no)
    const handleSurveyResponse = (response: boolean) => {
        setShowSurveyPrompt(false);
        if (response) {
            setShowSurvey(true);
        }
    };


    // function to handle survey submission
    const handleSurveySubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // hide survey
            setShowSurvey(false);

            // set loading state to show overlay
            setLoading(true);

            // send survey data to backend
            const response = await axios.post(
                "http://localhost:8000/user/weekly-survey",
                { feedbackData },
                { headers: { Authorization: `Bearer ${auth?.user?.access_token}` } }
            );

            // hide survey
            setShowSurvey(false);

            // set loading state to show overlay
            setLoading(true);

            console.log("Survey submitted successfully:", response.data);

        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setLoading(false);
        }
    };


    // cancel survey and close the modal
    const handleSurveyCancel = () => {
        setShowSurvey(false);
        setShowSurveyPrompt(false);
    };


    // useEffect to handle clicking outside the profile menu to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setProfileMenuOpen(false);
            }
        };

        if (profileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileMenuOpen]);


    // function to handle chat message submit
    const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (chatMessage.trim() === "") return;
    
        // immediately add user's message to UI
        const userMessage = chatMessage.trim();
        setChatLogs((prev) => [...prev, { sender: "user", text: userMessage }]);
        setChatMessage("");
    
        try {
            const response = await axios.post(
                "http://localhost:8000/chat",
                { message: userMessage },
                { headers: { Authorization: `Bearer ${auth?.user?.access_token}` } }
            );
            const assistantReply = response.data.reply;
            setChatLogs((prev) => [...prev, { sender: "model", text: assistantReply }]);
        } catch (error) {
            console.error("Failed to fetch assistant reply:", error);
            setChatLogs((prev) => [
                ...prev,
                { sender: "model", text: "Error retrieving response" },
            ]);
        }
    };


    // function to login user
    const handleLogin = () => {
        setProfileMenuOpen(false);
        router.push("/login");
    };


    // function to logout user
    const handleLogout = () => {
        try {
            // clear frontend authentication state
            if (auth?.logout) {
                auth.logout();
            }
            
            // clear any stored tokens
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            
            // close profile menu
            setProfileMenuOpen(false);
            
            // clear chat history
            setChatLogs([]);
            setChatMessage('');
            
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    // function to create new chat (clear chat logs and reset home screen)
    const handleNewChat = () => {
        setChatLogs([]);

        // reset chatMessage
        setChatMessage("");
    };


    return (
        <div className="min-h-screen bg-gray-100 relative text-black">
            {/* Main Header */}
            <header className="w-full bg-white shadow flex items-center justify-between px-4 py-3">
                {/* Apple Image */}
                <div>
                    <Image 
                        src="/apple.png"
                        alt="Apple" 
                        width={40} 
                        height={40}
                    />
                </div>

                {/* Enlarged CaloriQ Title */}
                <h1 className="text-3xl font-bold">CaloriQ</h1>

                {/* Broccoli Image */}
                <div>
                    <Image
                    // <a href="https://www.flaticon.com/free-icons/fruit" title="fruit icons">Fruit icons created by Freepik - Flaticon</a>
                        src="/broccoli.png"
                        alt="Broccoli"
                        width={40}
                        height={40}
                    />
                </div>
            </header>

            {/* Row Below Header */}
            <div className="w-full bg-white border-b flex items-center justify-between px-4 py-2">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleSidebar}
                        className="px-3 py-1 border rounded hover:bg-gray-200"
                        aria-label="Toggle Sidebar"
                    >
                        ☰
                    </button>
                    <button
                        onClick={handleNewChat}
                        className="px-3 py-1 border rounded hover:bg-gray-200"
                    >
                        New Chat
                    </button>
                </div>
                <div className="relative">
                    <button
                        onClick={toggleProfileMenu}
                        className="border rounded p-1 hover:bg-gray-200"
                        aria-label="Profile Menu"
                    >
                        <Image
                            src="/default-profile.png"
                            alt="Profile"
                            width={32}
                            height={32}
                        />
                    </button>

                    {/* Profile Menu with rounded corners */}
                    {profileMenuOpen && (
                        <div
                            ref={profileMenuRef}
                            className="absolute top-10 right-0 w-40 bg-white border shadow-md z-10 rounded-lg"
                        >
                            <ul className="flex flex-col">
                                {auth?.user ? (
                                    // Show these options when user is logged in
                                    <>
                                        <li 
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            // onClick={}
                                        >
                                            Profile
                                        </li>
                                        <li 
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            // onClick={}
                                        >
                                            Settings
                                        </li>
                                        <li 
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => router.push("/meal")}
                                        >
                                            Meal Plan
                                        </li>
                                        <li
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => router.push("/workout")}
                                        >
                                            Workout Plan
                                        </li>
                                        <li
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </li>
                                    </>
                                ) : (
                                    // Show login option when user is not logged in
                                    <li
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Bar with Slide Animation */}
            <aside
                className={`fixed top-[8.7rem] left-0 w-64 h-full bg-white shadow z-20 p-4 transform transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <ul className="space-y-4">
                    <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => router.push("/meal")}>
                        Meal Prep
                    </li>
                    <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => router.push("/workout")}>
                        Workout Routine
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main
                className={`pt-10 px-4 transition-all duration-300 ${
                    sidebarOpen ? "ml-64" : "ml-0"
                }`}
            >
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-11rem)]">
                    {/* Only show the initial heading when there are no chat logs */}
                    {chatLogs.length === 0 && (
                        <h2 className="text-3xl font-semibold mb-6 text-center">
                            Start Your Fitness Journey Today!
                        </h2>
                    )}

                    {/* Chat Logs */}
                    {/* <div className="w-full max-w-md space-y-2 mb-6">
                        {chatLogs.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg max-w-[80%] ${
                                    msg.sender === "user"
                                        ? "bg-blue-600 text-white self-end ml-auto"
                                        : "bg-gray-300 text-black self-start mr-auto"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div> */}

                    {/* Chat Logs */}
                    <div className="w-full max-w-md mb-6">
                        {chatLogs.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`rounded-lg max-w-[80%] mb-20 ${
                                    msg.sender === "user"
                                        ? "bg-blue-600 text-white self-end ml-28"
                                        : "bg-gray-300 text-black self-start mr-28"
                                }`}
                            >
                                <p className="p-2">{msg.text}</p>
                            </div>
                        ))}
                    </div>


                    {/* Chat Input Box */}
                    <form
                        onSubmit={handleChatSubmit}
                        className="relative w-full max-w-md text-center mb-40"
                    >
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Message CaloriQ..."
                            className="w-full border rounded-full py-3 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 focus:outline-none"
                            aria-label="Send message"
                        >
                            →
                        </button>
                    </form>
                </div>
            </main>

            {/* Survey Prompt Modal */}
            {/* {showSurveyPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Weekly Feedback Survey</h3>
                        <p className="mb-4">Would you like to provide feedback about last week's plan?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => handleSurveyResponse(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                No Thanks
                            </button>
                            <button
                                onClick={() => handleSurveyResponse(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Survey Modal */}
            {showSurvey && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <form onSubmit={handleSurveySubmit} className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-xl font-semibold mb-4">Weekly Feedback</h3>
                        
                        {/* Workout Feedback */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-2">Workout Feedback</h4>
                            <input
                                type="text"
                                placeholder="What workouts did you like? Ex: Incline Bench Press, Squats, etc."
                                className="border rounded w-full p-2 mb-2"
                                value={feedbackData.workout.liked}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    setInputText(prev => ({ ...prev, workoutLiked: raw }));
                                    setFeedbackData(prev => ({
                                        ...prev,
                                        workout: {
                                            ...prev.workout,
                                            liked: parseCommaSeparatedInput(raw)
                                        }
                                    }));
                                }}
                            />
                            <input
                                type="text"
                                placeholder="What workouts did you dislike? Ex: Shoulder Press, Deadlifts, etc."
                                className="border rounded w-full p-2 mb-2"
                                value={feedbackData.workout.disliked}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    setInputText(prev => ({ ...prev, workoutDisliked: raw }));
                                    setFeedbackData(prev => ({
                                        ...prev,
                                        workout: {
                                            ...prev.workout,
                                            liked: parseCommaSeparatedInput(raw)
                                        }
                                    }));
                                }}
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={feedbackData.workout.newPlan}
                                    onChange={(e) => setFeedbackData(prev => ({
                                    ...prev,
                                    workout: { ...prev.workout, newPlan: e.target.checked }
                                    }))}
                                    className="form-checkbox h-4 w-4"
                                />
                                <span>Create new workout plan</span>
                            </label>
                        </div>

                        {/* Meal Feedback */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-2">Meal Feedback</h4>
                            <input
                                type="text"
                                placeholder="What meals did you like? Ex: Chicken Salad, Quinoa Bowl, etc."
                                className="border rounded w-full p-2 mb-2"
                                value={feedbackData.meals.liked}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    setInputText(prev => ({ ...prev, mealsLiked: raw }));
                                    setFeedbackData(prev => ({
                                        ...prev,
                                        workout: {
                                            ...prev.workout,
                                            liked: parseCommaSeparatedInput(raw)
                                        }
                                    }));
                                }}
                            />
                            <input
                                type="text"
                                placeholder="What meals did you dislike? Ex: Steamed Broccoli, Egg Fried Rice, etc."
                                className="border rounded w-full p-2 mb-2"
                                value={feedbackData.meals.disliked}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    setInputText(prev => ({ ...prev, mealsDisliked: raw }));
                                    setFeedbackData(prev => ({
                                        ...prev,
                                        workout: {
                                            ...prev.workout,
                                            liked: parseCommaSeparatedInput(raw)
                                        }
                                    }));
                                }}
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={feedbackData.meals.newPlan}
                                    onChange={(e) => setFeedbackData(prev => ({
                                    ...prev,
                                    meals: { ...prev.meals, newPlan: e.target.checked }
                                    }))}
                                    className="form-checkbox h-4 w-4"
                                />
                                <span>Create new meal plan</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleSurveyCancel}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Submit Feedback
                            </button>
                        </div>
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

export default HomePage;

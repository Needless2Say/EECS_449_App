"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
    // initialize toggles for sidebar and profile menu pop up
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // initialize variable to hold user's message to chatbot
    const [chatMessage, setChatMessage] = useState("");

    // initialize router for redirectoring or routing user to different pages
    const router = useRouter();

    // toggle handlers for status
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

    // function to handle message submit to send to chatbot in backend API
    const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Sending message:", chatMessage);
        // Call your API or handle the message here
        setChatMessage("");
    };

    // function to logout user
    const handleLogout = () => {
        console.log("Logging out...");
        // login function will be put in eventually
    };

    return (
        <div className="min-h-screen bg-gray-100 relative text-black">
            {/* Main Header */}
            <header className="w-full bg-white shadow flex items-center justify-between px-4 py-3">
                {/* Apple Image */}
                <div>
                    <Image src="/apple.png" alt="Apple" width={40} height={40} />
                </div>

                {/* CaloriQ Title */}
                <h1 className="text-2xl md:text-3xl font-bold">CaloriQ</h1>

                {/* Broccoli Image */}
                <div>
                    <Image src="/broccoli.png" alt="Broccoli" width={40} height={40} />
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
                    <button className="px-3 py-1 border rounded hover:bg-gray-200">
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

                    {/* Profile Menu */}
                    {profileMenuOpen && (
                        <div className="absolute top-10 right-0 w-40 bg-white border shadow-md z-10">
                            <ul className="flex flex-col">
                                <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                <li className="p-2 hover:bg-gray-100 cursor-pointer">Meal Plan</li>
                                <li className="p-2 hover:bg-gray-100 cursor-pointer">Workout Plan</li>
                                <li
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Bar */}
            {sidebarOpen && (
                <aside className="fixed top-[7.5rem] left-0 w-64 h-full bg-white shadow z-20 p-4">
                    <ul className="space-y-4">
                        <li className="cursor-pointer hover:bg-gray-100 p-2">Chats</li>
                        <li className="cursor-pointer hover:bg-gray-100 p-2">Meal Prep</li>
                        <li className="cursor-pointer hover:bg-gray-100 p-2">Workout Routine</li>
                        <li className="cursor-pointer hover:bg-gray-100 p-2">Holiday Specials</li>
                    </ul>
                </aside>
            )}

            {/* Main Content */}
            <main
                className={`pt-10 px-4 transition-all duration-300 ${
                    sidebarOpen ? "ml-64" : "ml-0"
                }`}
            >
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-11rem)]">
                    <h2 className="text-3xl font-semibold mb-6 text-center">
                        Start Your Fitness Journey Today!
                    </h2>
                    {/* Chat Input Box */}
                    <form
                        onSubmit={handleChatSubmit}
                        className="relative w-full max-w-md text-center"
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
        </div>
    );
};

export default HomePage;

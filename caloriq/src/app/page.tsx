"use client";

import React, { useContext, useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import AuthContext from "./context/AuthContext";
import { useRouter } from "next/navigation";

// define a chat message interface
interface ChatMessage {
    sender: "user" | "model";
    text: string;
}

const HomePage: React.FC = () => {
    // create authentication variable by getting return value from custom context AuthContext
    const auth = useContext(AuthContext);

    // initialize toggles for sidebar and profile menu pop up
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // state for chat input and chat logs
    const [chatMessage, setChatMessage] = useState("");
    const [chatLogs, setChatLogs] = useState<ChatMessage[]>([]);

    // initialize router for redirecting or routing user to different pages
    const router = useRouter();

    // reference for profile menu (for click outside behavior)
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // toggle handlers for sidebar and profile menu
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);


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


    // function to handle message submit
    const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        // if user's message is just empty spaces, exit function
        if (chatMessage.trim() === "") return;

        // add user's message (align right)
        setChatLogs((prev) => [
            ...prev,
            { sender: "user", text: chatMessage.trim() },
        ]);

        // set user's message to empty string
        setChatMessage("");

        // add temporary waiting message (align left)
        setChatLogs((prev) => [
            ...prev,
            { sender: "model", text: "Waiting For Response" },
        ]);

        // after 5 seconds, remove waiting message and add final response
        setTimeout(() => {
            setChatLogs((prev) => {
                // remove waiting message
                const newLogs = prev.filter(
                    (msg) => msg.text !== "Waiting For Response"
                );

                // add final response from model (aligned left)
                return [...newLogs, { sender: "model", text: "CaloriQ responded" }];
            });
        }, 2000);
    };


    // function to login user
    const handleLogin = () => {
        setProfileMenuOpen(false);
        router.push("/login");
    };


    // function to logout user
    const handleLogout = () => {
        console.log("Logging out...");
        // logout logic here
    };


    // function to create new chat (clear chat logs and reset home screen)
    const handleNewChat = () => {
        setChatLogs([]);
        // optionally reset the chatMessage too
        setChatMessage("");
    };


    return (
        <div className="min-h-screen bg-gray-100 relative text-black">
            {/* Main Header */}
            <header className="w-full bg-white shadow flex items-center justify-between px-4 py-3">
                {/* Apple Image */}
                <div>
                    <Image src="/apple.png" alt="Apple" width={40} height={40} />
                </div>

                {/* Enlarged CaloriQ Title */}
                <h1 className="text-3xl font-bold">CaloriQ</h1>

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
                    {/* {profileMenuOpen && (
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
                    )} */}

                    {profileMenuOpen && (
                        <div
                            ref={profileMenuRef}
                            className="absolute top-10 right-0 w-40 bg-white border shadow-md z-10 rounded-lg"
                        >
                            <ul className="flex flex-col">
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
                    <li className="cursor-pointer hover:bg-gray-100 p-2">Chats</li>
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
        </div>
    );
};

export default HomePage;

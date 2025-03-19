"use client";

import React, { useContext, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import AuthContext from "../context/AuthContext";


const LoginPage: React.FC = () => {
    // create authentication variable by getting return value from custom context AuthContext
    const auth = useContext(AuthContext);

    // check if user is logged in on or
    if (!auth) {
        // since user's authentication status is not valid, return error
        throw new Error("AuthContext is not available! Did you forget to wrap <AuthProvider>?");
    }

    // grab login function from auth object
    const { login } = auth;

    // initialize username and password variable for user credentials
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    // handle login function for submitting existing user credentials to backend
    // e is a typed form event from HTML form and returns a promise that resolves to void
    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        // call login function from authentication context with existing user credentials
        login(username, password);
    };


    


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-black">
            {/* Login In Card */}
            <div className="w-full max-w-md bg-white rounded shadow p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Login
                </h2>

                {/* Username Field */}
                <label htmlFor="username" className="block mb-1 font-medium">
                    Username <span className="text-red-500">*</span>
                </label>
                <input
                    type="username"
                    id="username"
                    placeholder="Enter your username..."
                    className="border rounded w-full p-2 mb-4"
                />

                {/* Password Field */}
                <label htmlFor="password" className="block mb-1 font-medium">
                    Password <span className="text-red-500">*</span>
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your password..."
                    className="border rounded w-full p-2 mb-4"
                />

                {/* Login Button */}
                <button className="bg-blue-600 text-white w-full p-2 rounded mb-6 hover:bg-blue-700 text-lg">
                    Login
                </button>

                {/* Sign Up Link */}
                <p className="text-m text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 underline">
                        Sign Up!
                    </Link>
                </p>
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
                        src="/google-icon.png"
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
                        src="/facebook-icon.png"
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
                        src="/github-icon.png"
                        alt="GitHub"
                        width={20}
                        height={20}
                        className="mr-2"
                    />
                        Continue with GitHub
                </button>

                {/* Add other social auth providers below, e.g. Apple, Twitter, GitHub, etc. */}


            </div>
        </div>
    );
};

export default LoginPage;

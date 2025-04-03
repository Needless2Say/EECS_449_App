"use client";

import React, { createContext, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


// interface for authentication context
export interface AuthContextType {
	user: any; // current user data (could be dictionary, variable, etc.)
	login: (username: string, password: string) => Promise<void>; // function that accepts username and password, and returns a promise of void (no value)
	logout: () => void; // function to logout user with no parameters or return value
}

// default initialization for AuthContext
const defaultAuthContext: AuthContextType = {
	user: null,
	login: async () => {},
	logout: () => {},
}


// interface for expected props for authentication context provider
interface AuthProviderProps {
	children: ReactNode; // child components that will have access to context
}


// create new context that is of type AuthContextType or null and has default value of null
const AuthContext = createContext<AuthContextType>(defaultAuthContext);


// export Authentication Provider component to serve as context provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// initialize user variable to hold info on user
	const [user, setUser] = useState<any>(null);

	// initialize router variable
	const router = useRouter();

	// async login function
	const login = async (username: string, password: string) => {
		// try following code
		try {
			// initialize formData object to hold data and send data on user
			const formData = new FormData();

			// add username and password as dictionary items to formData object
			formData.append("username", username);
			formData.append("password", password);

			// use axios to send a POST request to specified URL
			// include formData as body of request
			// headers tells server how to interpret data
			const response = await axios.post("http://localhost:8000/auth/token", formData, {
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});

			// once response is recieved, set default Authorization header for all subsequent axios requests
			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

			// save access token in browser's local storage to persist across sessions or page refreshes
			localStorage.setItem("token", response.data.access_token);

			// set user variable to recieved in response from backend
			setUser(response.data);

			// redirect user to homepage
			// router.push("/");

		} catch (error) { // catch any errors during login
			// output error message to user
			console.error("Login Failed: ", error);
		}
	};

	// logout function
	const logout = () => {
		// set user variable to null
		setUser(null);

		// remove default Authorization header from axios so subsequent requests don't use expired token 
		delete axios.defaults.headers.common["Authorization"];

		// redirect user to login page
		router.push("/login");
	};

	// return authentication context for use
	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// export AuthContext as default export for other parts of application to use
export default AuthContext;

"use client";

import React, { useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext"; // Adjust the import based on your actual file structure

// interface for component's props
interface ProtectedRouteProps {
	children: ReactNode; // represents nested components or elements that should be rendered only if the user is authenticated
}

// component that uses preops defined by ProtectedRouteProps and conditionally renders children based on authentication status
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	// retrieves current authentication context value
	const auth = useContext(AuthContext);

	// initialize router variable
	const router = useRouter();

	// runs when page loads, when authentication status changes, or when router instance is updated
	useEffect(() => {
		// check if user is authenticated
		if (!auth?.user) {
			// if not authenticaed, redirect to login page
			router.push("/login");
		}
	}, [auth?.user, router]);

	// if user not logged in, return null
	return auth?.user ? <>{children}</> : null;
};

// export component ProtectedRoute for application to use
export default ProtectedRoute;

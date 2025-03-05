"use client";

import React, { useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext"; // Adjust the import based on your actual file structure

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // The context could be null if you typed it as `AuthContextType | null`
  // If your AuthContext always provides a non-null value, you can add a "!"
  // e.g. const { user } = useContext(AuthContext)!;
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push("/login");
    }
  }, [auth?.user, router]);

  // If user is not logged in, return null (so no UI is rendered)
  return auth?.user ? <>{children}</> : null;
};

export default ProtectedRoute;

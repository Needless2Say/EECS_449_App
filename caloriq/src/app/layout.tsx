// RootLayout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode } from "react";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import { PlanProvider } from "./context/PlanContext";

// Create an interface (or type) for your component props
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <AuthProvider>
            <PlanProvider>
                <html lang="en">
                    <body>
                        {children}
                        <script
                            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                            crossOrigin="anonymous"
                        ></script>
                    </body>
                </html>
            </PlanProvider>
        </AuthProvider>
    );
}

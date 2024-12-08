import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { Employee } from "@/util/ZodTypes";

// Define props type to pass user data to children components
type ProtectedRouteProps = {
    children: (user: Employee) => ReactNode;
};

// Component for protected routes that require user authentication
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    // Show loading message while checking authentication
    if (loading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, return null
    if (!user) {
        return null;
    }

    // Call children as function, passing user
    return <>{children(user)}</>;
}

// Example Usage:
{/* 
<ProtectedRoute>
    {(user) => (
        <p> This is the user! {user} </p>
    )}
</ProtectedRoute>
*/}
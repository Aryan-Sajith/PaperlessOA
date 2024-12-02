// Custom hook to handle user authentication state and protected route access
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/util/path';
import { Employee } from '@/util/ZodTypes';

// Interface defining the authentication state returned by useAuth
interface AuthState {
    user: Employee | null;  // Current authenticated user or null if not authenticated
    loading: boolean;       // Loading state while checking authentication
}

export function useAuth(): AuthState {
    // State to store authenticated user data
    const [user, setUser] = useState<Employee | null>(null);
    // Loading state for authentication check
    const [loading, setLoading] = useState(true);
    // Router instance for navigation
    const router = useRouter();

    // Effect runs on component mount to check authentication status
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch current user data from backend
                const res = await fetch(`${API_BASE}/current_user`, {
                    credentials: 'include'  // Include cookies for session authentication
                });

                if (!res.ok) {
                    // If not authenticated, redirect to login
                    router.push('/login');
                    return;
                }

                // Parse and store authenticated user data
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                // On error, assume not authenticated and redirect
                router.push('/login');
            } finally {
                // Update loading state after auth check completes
                setLoading(false);
            }
        };

        // Execute auth check
        fetchUser();
    }, []); // Empty dependency array - only run on mount

    // Return current auth state
    return { user, loading };
}
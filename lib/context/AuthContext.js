import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push('/'); // Redirect to home page after login
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push('/login');
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                signUp,
                signIn,
                signOut,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 
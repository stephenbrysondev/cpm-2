import { useAuth } from '../lib/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loader from './Loader';

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <Loader message="Checking authentication..." />;
    }

    return user ? children : null;
} 
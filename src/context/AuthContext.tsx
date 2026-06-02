import { AuthContext } from './AuthContextObject';
import { supabase } from '../api/SupabaseClient';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState, type ReactNode } from 'react';

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        async function getInitialSession(): Promise<void> {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
            }
            setLoading(false);
        }

        getInitialSession();

    }, []);

    return (
        <AuthContext.Provider
            value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )

}
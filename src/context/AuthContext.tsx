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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(function (_, session) {
            setUser(session?.user ?? null);
        });

        return function () {
            subscription.unsubscribe();
        };

    }, []);

    async function login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            throw error;
        }
        return data;
    }

    async function logout() {
        await supabase.auth.signOut();
    }

    async function signup(email: string, password: string, name: string, phone: string) {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    name: name,
                    phone: phone
                }
            }
        });
        if (error) {
            throw error;
        }
        return data;
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, signup }}
        >
            {children}
        </AuthContext.Provider>
    )

}
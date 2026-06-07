import { AuthContext } from './AuthContextObject';
import { supabase } from '../api/SupabaseClient';
import type { User, AuthResponse } from '@supabase/supabase-js';
import { useEffect, useState, type ReactNode } from 'react';

interface Workspace {
    id: string;
    name: string;
    description: string;
    user_id: string;
}

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [workspace, setWorkspace] = useState<string>("");


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

    async function signup(email: string, password: string, name: string, phone: string): Promise<AuthResponse['data']> {
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

    async function deleteMyAccount(): Promise<boolean> {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('No active user session found.');
        }

        try {
            const { error } = await supabase.functions.invoke('delete-user', {
                method: 'POST'
            });

            if (error) {
                throw error;
            }

            await supabase.auth.signOut({ scope: 'local' });

            return true;
        } catch (err) {
            console.error('Account deletion execution failed:', err);
            throw err;
        }
    }

    async function createWorkspace(name: string, description: string): Promise<boolean> {
        const { error } = await supabase.from('workspaces')
            .insert({
                name: name,
                description: description,
                user_id: user?.id
            });
        if (error) {
            throw error;
        }
        return true;
    }

    async function deleteWorkspace(workspaceId: string): Promise<boolean> {
        const { error } = await supabase.from('workspaces')
            .delete()
            .eq('id', workspaceId);
        if (error) {
            throw error;
        }
        return true;
    }

    async function getWorkspaces(): Promise<Workspace[]> {
        const { data, error } = await supabase.from('workspaces')
            .select('*')
            .eq('user_id', user?.id);
        if (error) {
            throw error;
        }
        return data;
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, setLoading, login, logout, signup, deleteMyAccount, createWorkspace, deleteWorkspace, getWorkspaces, workspace, setWorkspace }}
        >
            {children}
        </AuthContext.Provider>
    )

}
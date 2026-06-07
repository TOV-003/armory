import { AuthContext } from './AuthContextObject';
import { supabase } from '../api/SupabaseClient';
import type { User, AuthResponse } from '@supabase/supabase-js';
import { useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';

interface Workspace {
    id: string;
    name: string;
    description: string;
    user_id: string;
}

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [workspace, setWorkspace] = useState<{ workspace_id: string, workspace_name: string }>({ workspace_id: "", workspace_name: "" });

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(prev => {
                if (prev?.id === session?.user?.id) return prev;
                return session?.user ?? null;
            });
            setLoading(prev => {
                if (prev === false) return prev;
                return false;
            });
        });

        return () => subscription.unsubscribe();
    }, []);


    const login = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const signup = useCallback(async (
        email: string,
        password: string,
        name: string,
        phone: string
    ): Promise<AuthResponse['data']> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, phone } }
        });
        if (error) throw error;
        return data;
    }, []);

    const deleteMyAccount = useCallback(async (): Promise<boolean> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active user session found.');

        const { error } = await supabase.functions.invoke('delete-user', { method: 'POST' });
        if (error) throw error;

        await supabase.auth.signOut({ scope: 'local' });
        return true;
    }, []);

    const createWorkspace = useCallback(async (name: string, description: string): Promise<boolean> => {
        if (user === null) throw new Error('No authenticated user.');

        const { error } = await supabase.from('workspaces').insert({
            name,
            description,
            user_id: user.id
        });
        if (error) throw error;
        return true;
    }, [user]);

    const deleteWorkspace = useCallback(async (workspaceId: string): Promise<boolean> => {
        const { error } = await supabase.from('workspaces').delete().eq('id', workspaceId);
        if (error) throw error;
        return true;
    }, []);

    const getWorkspaces = useCallback(async (): Promise<Workspace[]> => {
        if (user === null) return [];

        const { data, error } = await supabase.from('workspaces')
            .select('*')
            .eq('user_id', user.id);
        if (error) throw error;
        return data;
    }, [user]);

    const createEquipment = useCallback(async (
        name: string,
        category: string,
        serial_number: string
    ): Promise<boolean> => {
        if (user === null) throw new Error('No authenticated user.');

        const { error } = await supabase.from('equipment').insert({
            name,
            category,
            serial_number,
            user_id: user.id,
            workspace_id: workspace.workspace_id
        });
        console.log("Equipment created:", name, category, serial_number, user.id, workspace);
        if (error) throw error;
        return true;
    }, [user, workspace]);

    const setLastActiveWorkspace = useCallback(async (workspaceId: string, workspaceName: string): Promise<boolean> => {
        if (user === null) throw new Error('No authenticated user.');

        const { error } = await supabase.from('last_workspace').upsert({
            user_id: user.id,
            workspace_id: workspaceId,
            workspace_name: workspaceName
        }, { onConflict: 'user_id' });
        if (error) throw error;
        return true;
    }, [user]);

    const getLastActiveWorkspace = useCallback(async (): Promise<{ workspace_id: string; workspace_name: string } | null> => {
        if (user === null) return null;

        const { data, error } = await supabase
            .from('last_workspace')
            .select('workspace_id, workspace_name')
            .eq('user_id', user.id)
            .maybeSingle();
        if (error) throw error;
        return data ?? null;
    }, [user]);

    const value = useMemo(() => ({
        user,
        loading,
        setLoading,
        login,
        logout,
        signup,
        deleteMyAccount,
        createWorkspace,
        deleteWorkspace,
        getWorkspaces,
        workspace,
        setWorkspace,
        createEquipment,
        setLastActiveWorkspace,
        getLastActiveWorkspace,
    }), [
        user,
        loading,
        login,
        logout,
        signup,
        deleteMyAccount,
        createWorkspace,
        deleteWorkspace,
        getWorkspaces,
        workspace,
        createEquipment,
        setLastActiveWorkspace,
        getLastActiveWorkspace,
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
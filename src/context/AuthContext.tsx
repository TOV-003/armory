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

interface Equipment {
    id: string;
    name: string;
    category: string;
    serial_number: string;
    user_id: string;
    workspace_id: string;
    created_at: string;
    updated_at: string;
    state: string;
}

interface Missions {
    id: string;
    name: string;
    serial_number: string;
    user_id: string;
    workspace_id: string;
    start_date: Date;
    status: string;
}

interface EquipmentLog {
    id: string;
    equipment_id: string;
    action_type: string;
    user_id: string;
    workspace_id: string;
    mission_id: string;
    notes: string | null;
    timestamp: Date;
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

    const loginWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })
        if (error) throw error
    }, [])

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

    const updateUser = useCallback(async (name: string, phone: string): Promise<boolean> => {
        const { error } = await supabase.auth.updateUser({
            data: { name, phone },
        });
        if (error) throw error;

        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        return true;
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

    const createEquipment = useCallback(async (name: string, category: string, serial_number: string): Promise<Equipment> => {
        if (user === null) throw new Error('No authenticated user.');

        const { data, error } = await supabase.from('equipment')
            .insert({ name, category, serial_number, user_id: user.id, workspace_id: workspace.workspace_id })
            .select()
            .single();
        if (error) throw error;
        return data;
    }, [user, workspace]);

    const getEquipments = useCallback(async (): Promise<Equipment[]> => {
        if (user === null) return [];

        const { data, error } = await supabase.from('equipment')
            .select('*')
            .eq('user_id', user.id)
        if (error) throw error;
        return data;
    }, [user]);

    const updateEquipmentState = useCallback(async (equipmentId: string, newState: string): Promise<boolean> => {
        const { error } = await supabase.from('equipment')
            .update({ state: newState })
            .eq('id', equipmentId);
        if (error) throw error;
        return true;
    }, []);

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

    const getMissions = useCallback(async (): Promise<Missions[]> => {
        if (user === null) return [];

        const { data, error } = await supabase.from('missions')
            .select('*')
            .eq('user_id', user.id)
        if (error) throw error;
        return data;
    }, [user]);

    const createMission = useCallback(async (name: string, start_date: Date): Promise<Missions> => {
        if (user === null) throw new Error('No authenticated user.');

        const { data, error } = await supabase.from('missions')
            .insert({ name, start_date: start_date.toISOString(), workspace_id: workspace.workspace_id, user_id: user.id })
            .select()
            .single();
        if (error) throw error;
        return data;
    }, [user, workspace]);

    const updateMissionStatus = useCallback(async (missionId: string, newStatus: string): Promise<boolean> => {
        const { error } = await supabase.from('missions')
            .update({ status: newStatus })
            .eq('id', missionId);
        if (error) throw error;
        return true;
    }, []);

    const newEquipmentLog = useCallback(async (equipmentId: string, action_type: string, mission_id: string, notes: string | null, timestamp: Date): Promise<boolean> => {
        const { error } = await supabase.from('equipment_log')
            .insert({ equipment_id: equipmentId, action_type, user_id: user?.id, workspace_id: workspace.workspace_id, mission_id: mission_id, notes, timestamp: timestamp.toISOString() })
            .select()
            .single();
        if (error) throw error;
        return true;
    }, [user, workspace]);

    const getEquipmentLogs = useCallback(async (userId: string): Promise<EquipmentLog[]> => {
        const { data, error } = await supabase.from('equipment_log')
            .select('*')
            .eq('user_id', userId);
        if (error) throw error;
        return data;
    }, []);

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
        getEquipments,
        updateEquipmentState,
        getMissions,
        createMission,
        newEquipmentLog,
        updateMissionStatus,
        getEquipmentLogs,
        updateUser,
        loginWithGoogle
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
        getEquipments,
        updateEquipmentState,
        getMissions,
        createMission,
        newEquipmentLog,
        updateMissionStatus,
        getEquipmentLogs,
        updateUser,
        loginWithGoogle
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
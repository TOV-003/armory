import { createContext } from 'react';
import type { User, Session, AuthResponse } from '@supabase/supabase-js';

interface Workspace {
    id: string;
    name: string;
    description: string;
    user_id: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ user: User; session: Session; weakPassword?: { message: string } | undefined }>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, name: string, phone: string) => Promise<AuthResponse['data']>;
    deleteMyAccount: () => Promise<boolean>;
    createWorkspace: (name: string, description: string) => Promise<boolean>;
    getWorkspaces: () => Promise<Workspace[]>;
    deleteWorkspace: (workspaceId: string) => Promise<boolean>;
    setLoading: (loading: boolean) => void;
    workspace: string;
    setWorkspace: (workspace: string) => void;
    createEquipment: (name: string, category: string, serial_number: string) => Promise<boolean>;
    setLastActiveWorkspace: (workspaceId: string) => Promise<boolean>;
    getLastActiveWorkspace: () => Promise<string | null>;
}
export const AuthContext = createContext<AuthContextType | null>(null);
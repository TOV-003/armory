import { createContext } from 'react';
import type { User, Session, AuthResponse } from '@supabase/supabase-js';

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
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    workspace: { workspace_id: string; workspace_name: string };
    setWorkspace: React.Dispatch<React.SetStateAction<{ workspace_id: string; workspace_name: string }>>;
    createEquipment: (name: string, category: string, serial_number: string) => Promise<Equipment>;
    getEquipments: () => Promise<Equipment[]>;
    setLastActiveWorkspace: (workspaceId: string, workspaceName: string) => Promise<boolean>;
    getLastActiveWorkspace: () => Promise<{ workspace_id: string; workspace_name: string } | null>;
    updateEquipmentState: (equipmentId: string, newState: string) => Promise<boolean>;
}
export const AuthContext = createContext<AuthContextType | null>(null);
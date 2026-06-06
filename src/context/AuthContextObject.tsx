import { createContext } from 'react';
import type { User, Session, AuthResponse } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ user: User; session: Session; weakPassword?: { message: string } | undefined }>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, name: string, phone: string) => Promise<AuthResponse['data']>;
}
export const AuthContext = createContext<AuthContextType | null>(null);
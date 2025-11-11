'use client';

import { createContext } from 'react';
import type { AuthContextType } from '@/hooks/use-auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
import { ReactNode } from 'react';

import { User } from 'shared/user/User';


export interface AuthContentProps {
    onLoggedInChange: (logged: boolean) => void;
    onAuthLoadingChange: (loading: boolean) => void;
    children: ReactNode;
}

export interface AuthStoreState {
    loading: boolean;
    isAuth: boolean;
    user: User | null;
}

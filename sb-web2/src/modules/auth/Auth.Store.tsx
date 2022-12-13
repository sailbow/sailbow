import React, { createContext, ReactNode, useReducer, useContext, Dispatch, FC, useEffect } from 'react';

import { resetLocalStorage, setHeadersToLocalStorage } from 'util/http/Http';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { showErrorToast } from 'shared/toast/Toast';
import { User, getUser } from 'shared/user/User';
import { LocalStorageKeys, LS } from 'util/localstorage/LocalStorage';

import { providerLogin, authorize, Provider } from './Auth.Service';
import { AuthStoreState, AuthContentProps } from './Auth.Types';

export enum AuthStoreActionType {
    SetUser,
    SetIsAuth,
    SetLoading,
}

interface PayloadSetUser {
    user: User | null;
}

interface PayloadSetIsAuth {
    auth: boolean;
}

interface PayloadSetLoading {
    loading: boolean;
}

interface AuthStoreAction {
    type: AuthStoreActionType;
    payload?: PayloadSetUser | PayloadSetIsAuth | PayloadSetLoading;
}

interface AuthStoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: AuthStoreState = {
    user: null,
    loading: false,
    isAuth: false,
};

const AuthStoreStateContext = createContext<AuthStoreState | undefined>(undefined);
const AuthStoreDispatchContext = createContext<Dispatch<AuthStoreAction> | undefined>(undefined);

const storeReducer = (state: AuthStoreState, action: AuthStoreAction): AuthStoreState => {
    switch (action.type) {
        case AuthStoreActionType.SetLoading:
            return {
                ...state,
                loading: (action.payload as PayloadSetLoading).loading,
            };
        case AuthStoreActionType.SetUser: {
            return {
                ...state,
                user: (action.payload as PayloadSetUser).user,
            };
        }
        case AuthStoreActionType.SetIsAuth:
            return {
                ...state,
                isAuth: (action.payload as PayloadSetIsAuth).auth,
            };
        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const AuthStoreProvider: FC<AuthStoreProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, initialStoreState);

    return (
        <AuthStoreStateContext.Provider value={state}>
            <AuthStoreDispatchContext.Provider value={dispatch}>{children}</AuthStoreDispatchContext.Provider>
        </AuthStoreStateContext.Provider>
    );
};

export const useAuthStoreState = (): AuthStoreState => {
    const context = useContext(AuthStoreStateContext);

    if (context === undefined) {
        throw new Error('useAuthStoreState must be within AuthStoreProvider');
    }

    return context;
};

export const useAuthStoreDispatch = (): Dispatch<AuthStoreAction> => {
    const context = useContext(AuthStoreDispatchContext);

    if (context === undefined) {
        throw new Error('useAuthStoreDispatch must be within AuthStoreProvider');
    }

    return context;
};

interface AuthStoreActionApis {
    setUser: (user: User | null) => void;
    setIsAuth: (auth: boolean) => void;
    setLoading: (loading: boolean) => void;
    getLocalUser: () => void;
    providerLogin: (provider: Provider, state: string) => Promise<string | null>;
    authorize: (provider: Provider, code: string) => Promise<boolean>;
    // signUp: (user: UserSignUpType) => Promise<boolean>;
    // signIn: (user: UserSignInType) => Promise<boolean>;
    logout: () => Promise<boolean>;
    // forgotPassword: (email: string) => Promise<boolean>;
    // resetPassword: (email: string, hash: string) => Promise<boolean>;
    // updatedUser: (user: BasicInfoFormState) => void;
    // updatePassword: (password: UpdatePasswordFormState) => Promise<boolean>;
}

export const useAuthStore = (): [AuthStoreState, AuthStoreActionApis] => {
    const state = useAuthStoreState();
    const dispatch = useAuthStoreDispatch();

    const actionApis: AuthStoreActionApis = {
        setUser: (user: User | null) => {
            dispatch({ type: AuthStoreActionType.SetUser, payload: { user } });
        },
        setIsAuth: (auth: boolean) => {
            dispatch({ type: AuthStoreActionType.SetIsAuth, payload: { auth } });
        },
        setLoading: (loading: boolean) => {
            dispatch({ type: AuthStoreActionType.SetLoading, payload: { loading } });
        },
        getLocalUser: () => {
            return state.user;
        },
        providerLogin: async (provider, urlState) => {
            try {
                const redirectUrl = await providerLogin(provider, urlState);

                return redirectUrl;
            } catch (error: any) {
                showErrorToast(error.response.data.message);
                return null;
            }
        },
        authorize: async (provider, code) => {
            try {
                const {
                    accessToken: { value: atValue },
                    refreshToken: { value: rtValue },
                } = await authorize(provider, code);

                setHeadersToLocalStorage(atValue, rtValue);
                return true;
            } catch (error: any) {
                console.log(error);
                showErrorToast(error.response.data.message);
                return false;
            }
        },
        logout: async () => {
            try {
                // await logout();
                resetLocalStorage();

                return true;
            } catch (error: any) {
                showErrorToast(error.response.data.message);
                return false;
            }
        },
        // forgotPassword: async (email: string) => {
        //     try {
        //         await forgotPassword(email);

        //         return true;
        //     } catch (error: any) {
        //         showErrorToast(error.response.data.message);
        //         return false;
        //     }
        // },
        // resetPassword: async (password: string, hash: string) => {
        //     try {
        //         await resetPassword({ password, hash });
        //         return true;
        //     } catch (error: any) {
        //         showErrorToast(error.response.data);
        //         return false;
        //     }
        // },
        // updatedUser: async (user: BasicInfoFormState) => {
        //     try {
        //         const updatedUser = await updateUser(user);

        //         dispatch({ type: AuthStoreActionType.SetUser, payload: { user: updatedUser } });
        //         showSuccessToast('Details successfully updated');
        //     } catch (error: any) {
        //         showErrorToast(error.response.data.message);
        //     }
        // },
        // updatePassword: async (password: UpdatePasswordFormState) => {
        //     try {
        //         await updatePassword({ newPassword: password.newPassword, oldPassword: password.oldPassword });
        //         showSuccessToast('Password successfully updated');
        //         return true;
        //     } catch (error: any) {
        //         showErrorToast(error.response.data.message);
        //         return false;
        //     }
        // },
    };

    return [useAuthStoreState(), actionApis];
};

export const Authenticator: FC<AuthContentProps> = ({ onLoggedInChange, onAuthLoadingChange, children }) => {
    const [{ loading, user }, { setLoading, setUser, setIsAuth }] = useAuthStore();

    useEffect(() => {
        (async () => {
            setLoading(true);
            onAuthLoadingChange(true);

            if (LS.getItem(LocalStorageKeys.AT)) {
                if (!user) {
                    try {
                        const data = await getUser();

                        setUser(data);
                        onLoggedInChange(true);
                        setLoading(false);
                        onAuthLoadingChange(false);
                        setIsAuth(true);
                    } catch (error) {
                        setLoading(false);
                        onAuthLoadingChange(false);
                        setUser(null);
                        setIsAuth(false);
                        onLoggedInChange(false);
                    }
                }
            } else {
                setLoading(false);
                onAuthLoadingChange(false);
                setUser(null);
                setIsAuth(false);
                onLoggedInChange(false);
            }
        })();
    }, []); // eslint-disable-line

    return loading && !user ? <PageSpinner loading={loading} /> : <>{children}</>;
};

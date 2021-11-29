import React, { ReactNode, createContext, Dispatch, useReducer, FunctionComponent, useContext, useEffect } from 'react';

import { Profile } from 'profile/Profile.Types';
import { Log } from 'util/logger/Logger';
import { getProfile } from './profile-loading/Profile.Service';

export enum ProfileActionType {
    FetchStart = 'FETCH_START',
    FetchSuccess = 'FETCH_SUCCESS',
    FetchError = 'FETCH_ERROR',
    SetProfile = 'SET_PROFILE',
}

interface PayloadFetchProfileSuccess extends Profile {}
interface PayloadFetchProfileError {
    error: any;
}

export interface ProfileAction {
    type: ProfileActionType;
    profile?: Profile;
    error?: any;
}

export interface ProfileContainer {
    profile?: Profile;
    loading: boolean;
    error?: any;
}

interface ProfileProviderProps {
    children: ReactNode;
}

const ProfileStateContext = createContext<ProfileContainer | undefined>(undefined);
const ProfileDispatchContext = createContext<Dispatch<ProfileAction> | undefined>(undefined);

const profileReducer = (container: ProfileContainer, action: ProfileAction): ProfileContainer => {
    const log = new Log();
    log.group(action.type);
    log.prev(container);

    switch (action.type) {
        case ProfileActionType.FetchStart: {
            const nextState = { loading: true };

            log.next(nextState);
            return nextState;
        }

        case ProfileActionType.FetchSuccess: {
            const payload = action.profile as PayloadFetchProfileSuccess;
            const nextState = { loading: false, profile: payload };

            log.next(nextState);
            return nextState;
        }

        case ProfileActionType.FetchError: {
            const payload = action.error as PayloadFetchProfileError;
            const nextState = { loading: false, error: payload.error };

            log.next(nextState);
            return nextState;
        }

        default:
            throw new TypeError(`Invalid action type -- ${action.type}`);
    }
};

export const ProfileProvider: FunctionComponent<ProfileProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(profileReducer, { loading: true });

    return (
        <ProfileStateContext.Provider value={state}>
            <ProfileDispatchContext.Provider value={dispatch}>{children}</ProfileDispatchContext.Provider>
        </ProfileStateContext.Provider>
    );
};

export const useProfileState = (): ProfileContainer => {
    const context = useContext(ProfileStateContext);

    if (context === undefined) {
        throw new Error('useProfileState must be used within a ProfileProvider');
    }

    return context;
};

const useProfileDispatch = (): Dispatch<ProfileAction> => {
    const context = useContext(ProfileDispatchContext);

    if (context === undefined) {
        throw new Error('useProfileDispatch must be used within a ProfileProvider');
    }

    return context;
};

interface ProfileActionApis {
    fetchProfileStart: () => void;
    fetchProfileSuccess: (profile: Profile) => void;
    fetchProfileError: (error: any) => void;
}

export const useProfile = (): [ProfileContainer, ProfileActionApis] => {
    const [profileContainer, dispatch] = [useProfileState(), useProfileDispatch()];

    useEffect(() => {
        if (!profileContainer.profile) {
            (async (): Promise<any> => {
                try {
                    dispatch({ type: ProfileActionType.FetchStart });

                    const data = await getProfile();
                    dispatch({ type: ProfileActionType.FetchSuccess, profile: data });
                } catch (error) {
                    dispatch({ type: ProfileActionType.FetchError, error });
                }
            })();
        }
    }, [profileContainer.profile, dispatch]);

    const actionApis: ProfileActionApis = {
        fetchProfileStart: () => {
            dispatch({ type: ProfileActionType.FetchStart });
        },
        fetchProfileSuccess: (profile: Profile) => {
            dispatch({ type: ProfileActionType.FetchSuccess, profile });
        },
        fetchProfileError: (error: any) => {
            dispatch({ type: ProfileActionType.FetchError, error });
        },
    };

    return [profileContainer, actionApis];
};

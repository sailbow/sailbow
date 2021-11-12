import React, { ReactNode, createContext, Dispatch, useReducer, FunctionComponent, useContext, useEffect } from 'react';
import { AxiosResponse } from 'axios';

import { ProfileEndpoints } from 'util/Endpoints';
import { Http } from 'util/Http';
import { Log } from 'util/Logger';
import { Role } from 'components/role/Role';

export interface Profile {
    dateCreated: string;
    email: string;
    id: string;
    name: string;
    provider: string;
    providerUserId: string;
}

export interface CrewMember {
    role: Role;
    info: string;
    email: string;
    name: string;
}

export enum ProfileActionType {
    FetchStart = 'FETCH_START',
    FetchSuccess = 'FETCH_SUCCESS',
    FetchError = 'FETCH_ERROR',
    SetProfile = 'SET_PROFILE',
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
            const nextState = { loading: false, profile: action.profile };
            log.next(nextState);
            return nextState;
        }

        case ProfileActionType.FetchError: {
            const nextState = { loading: false, error: action.error };
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

export const useProfile = (): [ProfileContainer, Dispatch<ProfileAction>] => {
    const [profileContainer, dispatch] = [useProfileState(), useProfileDispatch()];

    useEffect(() => {
        if (!profileContainer.profile) {
            (async (): Promise<any> => {
                try {
                    dispatch({ type: ProfileActionType.FetchStart });

                    const response: AxiosResponse<Profile> = await Http(ProfileEndpoints.Me);
                    dispatch({ type: ProfileActionType.FetchSuccess, profile: response.data });
                } catch (error) {
                    dispatch({ type: ProfileActionType.FetchError, error });
                }
            })();
        }
    }, [profileContainer.profile, dispatch]);

    return [profileContainer, dispatch];
};

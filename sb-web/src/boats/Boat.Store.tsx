import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoatService, getBoatService, getBannerImages, getAllBoatsService } from 'boats/Boat.Service';
import { Boat, BoatState, CreateBoat, Photo } from 'boats/Boat.Types';
import { Log } from 'util/logger/Logger';

export enum BoatActionType {
    SetCreateNav = 'SET_CREATE_NAV',
    SetError = 'SET_ERROR',
    SetBoat = 'SET_BOAT',
    SetCreateLoading = 'SET_CREATE_LOADING',
    SetGetLoading = 'SET_GET_LOADING',
    SetAllBoats = 'SET_ALL_BOATS',
}

interface PayloadCreateBoat extends CreateBoat {}

interface PayloadSetBoat extends Boat {}

interface PayloadSetAllBoats {
    boats: Boat[];
}

interface PayloadSetCreateNav {
    open: boolean;
}

interface PayloadError {
    error: any;
}

interface BoatAction {
    type: BoatActionType;
    payload: PayloadCreateBoat | PayloadSetBoat | PayloadError | boolean | PayloadSetCreateNav | PayloadSetAllBoats;
}

interface BoatProviderProps {
    children: ReactNode;
}

export const initialBoatState: BoatState = {
    boat: undefined,
    loading: {
        create: false,
        get: false,
    },
    createOpen: false,
    boats: [],
};

const BoatStateContext = createContext<BoatState | undefined>(undefined);
const BoatDispatchContext = createContext<Dispatch<BoatAction> | undefined>(undefined);

const boatReducer = (boatState: BoatState, action: BoatAction): BoatState => {
    const log = new Log();
    log.group(action.type);
    log.prev(boatState);

    switch (action.type) {
        case BoatActionType.SetBoat: {
            const payload = action.payload as PayloadSetBoat;
            const nextState = { ...boatState, boat: { ...payload } };

            log.next(nextState);

            return nextState;
        }
        case BoatActionType.SetCreateLoading: {
            const payload = action.payload as boolean;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, create: payload } };

            log.next(nextState);

            return nextState;
        }
        case BoatActionType.SetError: {
            const payload = action.payload as PayloadError;
            const nextState: BoatState = { ...boatState, error: { ...payload.error } };

            log.next(nextState);

            return nextState;
        }
        case BoatActionType.SetGetLoading: {
            const payload = action.payload as boolean;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, get: payload } };

            log.next(nextState);

            return nextState;
        }
        case BoatActionType.SetCreateNav: {
            const payload = action.payload as PayloadSetCreateNav;
            const nextState: BoatState = { ...boatState, createOpen: payload.open };

            log.next(nextState);

            return nextState;
        }
        case BoatActionType.SetAllBoats: {
            const payload = action.payload as PayloadSetAllBoats;
            const nextState: BoatState = { ...boatState, boats: payload.boats };

            log.next(nextState);

            return nextState;
        }
        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const BoatProvider: FunctionComponent<BoatProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(boatReducer, initialBoatState);

    return (
        <BoatStateContext.Provider value={state}>
            <BoatDispatchContext.Provider value={dispatch}>{children}</BoatDispatchContext.Provider>
        </BoatStateContext.Provider>
    );
};

const useBoatState = (): BoatState => {
    const context = useContext(BoatStateContext);

    if (context === undefined) {
        throw new Error('UseBoatState must be used within BoatProvider');
    }

    return context;
};

const useBoatDispatch = (): Dispatch<BoatAction> => {
    const context = useContext(BoatDispatchContext);

    if (context === undefined) {
        throw new Error('UseBoatState must be used within BoatProvider');
    }

    return context;
};

interface BoatActionApis {
    openCreateBoat: () => void;
    closeCreateBoat: () => void;
    createBoat: (boat: PayloadCreateBoat) => Promise<Boat | null>;
    getImages: (value: string, page: number) => Promise<Photo[]>;
    getBoat: (boatId: string) => Promise<Boat | null>;
    getBoats: () => Promise<Boat[] | null>;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatch = useBoatDispatch();

    const actionApis: BoatActionApis = {
        openCreateBoat: () => {
            dispatch({ type: BoatActionType.SetCreateNav, payload: { open: true } });
        },
        closeCreateBoat: () => {
            dispatch({ type: BoatActionType.SetCreateNav, payload: { open: false } });
        },
        createBoat: async (boat: CreateBoat) => {
            dispatch({ type: BoatActionType.SetCreateLoading, payload: true });
            try {
                const response = await createBoatService(boat);

                dispatch({ type: BoatActionType.SetCreateLoading, payload: false });
                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetCreateLoading, payload: false });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
        getBoat: async (boatId: string) => {
            dispatch({ type: BoatActionType.SetGetLoading, payload: true });
            try {
                const response = await getBoatService(boatId);

                dispatch({ type: BoatActionType.SetBoat, payload: response });
                dispatch({ type: BoatActionType.SetGetLoading, payload: false });

                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetGetLoading, payload: false });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
        getImages: (value: string, page: number) => {
            return getBannerImages(value, page);
        },
        getBoats: async () => {
            dispatch({ type: BoatActionType.SetGetLoading, payload: true });
            try {
                const response = await getAllBoatsService();

                dispatch({ type: BoatActionType.SetAllBoats, payload: { boats: response } });
                dispatch({ type: BoatActionType.SetGetLoading, payload: false });

                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetGetLoading, payload: false });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
    };

    return [useBoatState(), actionApis];
};

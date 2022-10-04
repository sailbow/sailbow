import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoat, getAllBoats, getBannerImages } from 'modules/boats/Boat.Service';
import { Boat, BoatState, CreateBoat, Crew, Photo } from 'modules/boats/Boat.Types';

export enum BoatActionType {
    SetCreateNav,
    SetError,
    SetBoat,
    SetCreateLoading,
    SetGetAllLoading,
    SetAllBoats,
}

interface PayloadCreateBoat extends CreateBoat {}

interface PayloadSetBoat extends Boat {}

interface PayloadLoading {
    loading: boolean;
}

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
    payload:
        | PayloadCreateBoat
        | PayloadSetBoat
        | PayloadError
        | PayloadLoading
        | PayloadSetCreateNav
        | PayloadSetAllBoats;
}

interface BoatProviderProps {
    children: ReactNode;
}

export const initialBoatState: BoatState = {
    boat: undefined,
    loading: {
        create: false,
        get: false,
        getAll: false,
    },
    createOpen: false,
    boats: [],
};

const BoatStateContext = createContext<BoatState | undefined>(undefined);
const BoatDispatchContext = createContext<Dispatch<BoatAction> | undefined>(undefined);

const boatReducer = (boatState: BoatState, action: BoatAction): BoatState => {
    switch (action.type) {
        case BoatActionType.SetBoat: {
            const payload = action.payload as PayloadSetBoat;
            const nextState = { ...boatState, boat: { ...payload } };

            return nextState;
        }
        case BoatActionType.SetCreateLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, create: loading } };

            return nextState;
        }
        case BoatActionType.SetError: {
            const payload = action.payload as PayloadError;
            const nextState: BoatState = { ...boatState, error: { ...payload.error } };

            return nextState;
        }
        case BoatActionType.SetGetAllLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, getAll: loading } };

            return nextState;
        }
        case BoatActionType.SetCreateNav: {
            const payload = action.payload as PayloadSetCreateNav;
            const nextState: BoatState = { ...boatState, createOpen: payload.open };

            return nextState;
        }
        case BoatActionType.SetAllBoats: {
            const payload = action.payload as PayloadSetAllBoats;
            const nextState: BoatState = { ...boatState, boats: payload.boats };

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
    // getBoat: (boatId: string) => Promise<Boat | null>;
    getBoats: () => Promise<Boat[] | null>;
    // getCrewByQuery: (query: string) => Promise<Crew[] | null>;
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
            dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: true } });
            try {
                const response = await createBoat(boat);

                dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: false } });
                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: false } });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
        // getBoat: async (boatId: string) => {
        //     dispatch({ type: BoatActionType.SetGetLoading, payload: true });
        //     try {
        //         const response = await getBoatService(boatId);

        //         dispatch({ type: BoatActionType.SetBoat, payload: response });
        //         dispatch({ type: BoatActionType.SetGetLoading, payload: false });

        //         return response;
        //     } catch (error: any) {
        //         dispatch({ type: BoatActionType.SetGetLoading, payload: false });
        //         dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
        //         return null;
        //     }
        // },
        getImages: (value: string, page: number) => {
            return getBannerImages(value, page);
        },
        getBoats: async () => {
            dispatch({ type: BoatActionType.SetGetAllLoading, payload: { loading: true } });
            try {
                const response = await getAllBoats();

                dispatch({ type: BoatActionType.SetAllBoats, payload: { boats: response } });
                dispatch({ type: BoatActionType.SetGetAllLoading, payload: { loading: false } });

                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetGetAllLoading, payload: { loading: false } });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
        // getCrewByQuery: async (query) => {
        //     try {
        //         return await getUsersByQuery(query);
        //     } catch (error: any) {
        //         return null;
        //     }
        // },
    };

    return [useBoatState(), actionApis];
};

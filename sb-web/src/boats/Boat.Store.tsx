import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoatService, getBoatService, getBannerImages } from 'boats/Boat.Service';
import { BannerType, Boat, BoatState, CreateBoat, Photo } from 'boats/Boat.Types';
import { Color } from 'theme/Colors';
import { Log } from 'util/logger/Logger';

export enum BoatActionType {
    SetError = 'SET_ERROR',
    SetBoat = 'SET_BOAT',
    SetCreateLoading = 'SET_CREATE_LOADING',
    SetGetLoading = 'SET_GET_LOADING',
}

interface PayloadCreateBoat extends CreateBoat {}

interface PayloadSetBoat extends Boat {}

interface BoatAction {
    type: BoatActionType;
    payload: PayloadCreateBoat | PayloadSetBoat | boolean;
}

interface BoatProviderProps {
    children: ReactNode;
}

export const initialBoatState: BoatState = {
    boat: {
        id: '',
        name: '',
        description: '',
        banner: {
            show: true, // whether it should be shown should be decided by the backend
            type: BannerType.Color,
            value: Color.Orange100,
            position: 50,
        },
        crew: [],
    },
    error: {},
    loading: {
        create: false,
        get: false,
    },
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
            const { payload } = action;
            const nextState: BoatState = { ...boatState, error: payload };

            log.next(nextState);

            return nextState;
        }
        case BoatActionType.SetGetLoading: {
            const payload = action.payload as boolean;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, get: payload } };

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
    createBoat: (boat: PayloadCreateBoat) => Promise<Boat | null>;
    getPexelsImagesAction: (value: string, page: number) => Promise<Photo[]>;
    getBoat: (boatId: string) => Promise<Boat | null>;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatch = useBoatDispatch();

    const actionApis: BoatActionApis = {
        createBoat: async (boat: CreateBoat) => {
            dispatch({ type: BoatActionType.SetCreateLoading, payload: true });
            try {
                const response = await createBoatService(boat);

                dispatch({ type: BoatActionType.SetCreateLoading, payload: false });
                return response;
            } catch (error) {
                dispatch({ type: BoatActionType.SetCreateLoading, payload: false });
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
            } catch (error) {
                dispatch({ type: BoatActionType.SetGetLoading, payload: false });
                return null;
            }
        },
        getPexelsImagesAction: (value: string, page: number) => {
            return getBannerImages(value, page);
        },
    };

    return [useBoatState(), actionApis];
};

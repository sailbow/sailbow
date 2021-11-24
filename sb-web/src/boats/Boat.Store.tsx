import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoatService, getPexelsImages } from 'boats/Boat.Service';
import { BannerType, BoatState, Photo } from 'boats/Boat.Types';
import { Color } from 'theme/Colors';
import { Log } from 'util/logger/Logger';

export enum BoatActionType {
    SetDetails = 'SET_DETAILS',
    AddCrew = 'ADD_CREW',
    RemoveCrew = 'REMOVE_CREW',
    SetBanner = 'SET_BANNER',
}

interface PayloadCreateBoat extends BoatState {}

interface BoatAction {
    type: BoatActionType;
    payload: PayloadCreateBoat;
}

interface BoatProviderProps {
    children: ReactNode;
}

export const initialBoatState: BoatState = {
    name: '',
    description: '',
    banner: {
        show: true, // whether it should be shown should be decided by the backend
        type: BannerType.Color,
        value: Color.Orange100,
        position: 50,
    },
    crew: [],
};

const BoatStateContext = createContext<BoatState | undefined>(undefined);
const BoatDispatchContext = createContext<Dispatch<BoatAction> | undefined>(undefined);

const boatReducer = (boatState: BoatState, action: BoatAction): BoatState => {
    const log = new Log();
    log.group(action.type);
    log.prev(boatState);

    switch (action.type) {
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
    createBoat: (boat: PayloadCreateBoat) => Promise<BoatState>;
    getPexelsImagesAction: (value: string, page: number) => Promise<Photo[]>;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatcher = useBoatDispatch();

    const actionApis: BoatActionApis = {
        createBoat: async (boat: BoatState) => {
            // axios request here
            return createBoatService(boat);
        },
        getPexelsImagesAction: (value: string, page: number) => {
            return getPexelsImages(value, page);
        },
    };

    return [useBoatState(), actionApis];
};

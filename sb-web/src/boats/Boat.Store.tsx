import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { Crew } from 'profile/Profile.Constants';
import { Color } from 'theme/Colors';
import { BannerType, BoatState } from 'boats/Boat.Types';
import { Log } from 'util/logger/Logger';

export enum BoatActionType {
    SetDetails = 'SET_DETAILS',
    AddCrew = 'ADD_CREW',
    RemoveCrew = 'REMOVE_CREW',
}

interface PayloadSetDetails {
    name: string;
    description?: string;
    banner?: {
        type: BannerType;
        value: string;
        position?: number;
    };
}

interface PayloadAddCrew extends Crew {}

interface PayloadRemoveCrew {
    email: string;
}

interface BoatAction {
    type: BoatActionType;
    payload: PayloadAddCrew | PayloadRemoveCrew | PayloadSetDetails;
}

interface BoatProviderProps {
    children: ReactNode;
}

const initialBoatState: BoatState = {
    name: '',
    description: '',
    banner: {
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
        case BoatActionType.SetDetails: {
            const nextState = { ...boatState, ...(action.payload as PayloadSetDetails) };
            log.next(nextState);
            return nextState;
        }
        case BoatActionType.RemoveCrew: {
            const payload = action.payload as PayloadRemoveCrew;
            const updatedCrewList = boatState.crew.filter((crew: Crew) => crew.email !== payload.email);
            const nextState = { ...boatState, crew: updatedCrewList };
            log.next(nextState);
            return nextState;
        }

        case BoatActionType.AddCrew: {
            const payload = action.payload as PayloadAddCrew;
            const nextState = { ...boatState, crew: [...boatState.crew, payload] };
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

export const useBoat = (): [BoatState, Dispatch<BoatAction>] => {
    return [useBoatState(), useBoatDispatch()];
};

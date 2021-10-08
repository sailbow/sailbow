import React, { createContext, Dispatch, FunctionComponent, ReactNode, useContext, useReducer } from 'react';
import { Color } from 'theme/Colors';

import { Log } from 'util/Logger';

export interface BoatState {
    name: string;
    description: string;
    bannerColor: Color;
    bannerLink: string;
}

export enum BoatActionType {
    SetDetails = 'SET_DETAILS',
}

export interface BoatAction {
    type: BoatActionType;
    payload: any;
}

interface BoatProviderProps {
    children: ReactNode;
}

const initialBoatState: BoatState = {
    name: '',
    description: '',
    bannerColor: Color.Orange100,
    bannerLink: '',
};

const BoatStateContext = createContext<BoatState | undefined>(undefined);
const BoatDispatchContext = createContext<Dispatch<BoatAction> | undefined>(undefined);

const boatReducer = (boatState: BoatState, action: BoatAction): BoatState => {
    const log = new Log();
    log.group(action.type);
    log.prev(boatState);

    switch (action.type) {
        case BoatActionType.SetDetails: {
            const nextState = { ...boatState, ...action.payload };
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

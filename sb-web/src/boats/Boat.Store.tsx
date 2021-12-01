import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoatService, getPexelsImages } from 'boats/Boat.Service';
import { BannerType, Boat, CreateBoat, Photo } from 'boats/Boat.Types';
import { Color } from 'theme/Colors';
import { Log } from 'util/logger/Logger';

export enum BoatActionType {
    SetBoat = 'SET_BOAT',
}

interface PayloadCreateBoat extends CreateBoat {}

interface PayloadSetBoat extends Boat {}

interface BoatAction {
    type: BoatActionType;
    payload: PayloadCreateBoat;
}

interface BoatProviderProps {
    children: ReactNode;
}

export const initialBoatState: Boat = {
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
};

const BoatStateContext = createContext<CreateBoat | undefined>(undefined);
const BoatDispatchContext = createContext<Dispatch<BoatAction> | undefined>(undefined);

const boatReducer = (boatState: CreateBoat, action: BoatAction): CreateBoat => {
    const log = new Log();
    log.group(action.type);
    log.prev(boatState);

    switch (action.type) {
        case BoatActionType.SetBoat: {
            const payload = action.payload as PayloadSetBoat;
            const nextState = { ...boatState, ...payload };
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

const useBoatState = (): CreateBoat => {
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
    createBoat: (boat: PayloadCreateBoat) => void;
    getPexelsImagesAction: (value: string, page: number) => Promise<Photo[]>;
}

export const useBoat = (): [CreateBoat, BoatActionApis] => {
    const dispatch = useBoatDispatch();

    const actionApis: BoatActionApis = {
        createBoat: async (boat: CreateBoat) => {
            const response = await createBoatService(boat);
            dispatch({ type: BoatActionType.SetBoat, payload: response });
        },
        getPexelsImagesAction: (value: string, page: number) => {
            return getPexelsImages(value, page);
        },
    };

    return [useBoatState(), actionApis];
};

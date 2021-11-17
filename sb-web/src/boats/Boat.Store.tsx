import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { getPexelsImages } from 'boats/Boat.Service';
import { BannerState, BannerType, BoatState, Photo, Crew } from 'boats/Boat.Types';
import { Color } from 'theme/Colors';
import { Log } from 'util/logger/Logger';

export enum BoatActionType {
    SetDetails = 'SET_DETAILS',
    AddCrew = 'ADD_CREW',
    RemoveCrew = 'REMOVE_CREW',
    SetBanner = 'SET_BANNER',
}

interface PayloadSetDetails extends Omit<BoatState, 'crew' | 'banner'> {}

interface PayloadAddCrew extends Crew {}

interface PayloadSetBanner extends BannerState {}

interface PayloadRemoveCrew {
    email: string;
}

interface BoatAction {
    type: BoatActionType;
    payload: PayloadAddCrew | PayloadRemoveCrew | PayloadSetDetails | PayloadSetBanner;
}

interface BoatProviderProps {
    children: ReactNode;
}

const initialBoatState: BoatState = {
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
        case BoatActionType.SetDetails: {
            const nextState: BoatState = { ...boatState, ...action.payload };

            log.next(nextState);
            return nextState;
        }
        case BoatActionType.RemoveCrew: {
            const payload = action.payload as PayloadRemoveCrew;
            const updatedCrewList = boatState.crew.filter((crew: Crew) => crew.email !== payload.email);
            const nextState: BoatState = { ...boatState, crew: updatedCrewList };

            log.next(nextState);
            return nextState;
        }
        case BoatActionType.AddCrew: {
            const payload = action.payload as PayloadAddCrew;
            const nextState: BoatState = { ...boatState, crew: [...boatState.crew, payload] };

            log.next(nextState);
            return nextState;
        }
        case BoatActionType.SetBanner: {
            const payload = action.payload as PayloadSetBanner;
            const nextState: BoatState = { ...boatState, banner: payload };

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
    setDetailsAction: (payload: PayloadSetDetails) => void;
    setBannerAction: (payload: PayloadSetBanner) => void;
    addCrewMemberAction: (payload: PayloadAddCrew) => void;
    removeCrewMemberAction: (payload: PayloadRemoveCrew) => void;
    getPexelsImagesAction: (value: string, page: number) => Promise<Photo[]>;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatcher = useBoatDispatch();

    const actionApis: BoatActionApis = {
        setDetailsAction: (payload: PayloadSetDetails) => {
            dispatcher({
                type: BoatActionType.SetDetails,
                payload,
            });
        },
        setBannerAction: (payload: PayloadSetBanner) => {
            dispatcher({
                type: BoatActionType.SetBanner,
                payload,
            });
        },
        addCrewMemberAction: (payload: PayloadSetDetails) => {
            dispatcher({
                type: BoatActionType.AddCrew,
                payload,
            });
        },
        removeCrewMemberAction: (payload: PayloadRemoveCrew) => {
            dispatcher({
                type: BoatActionType.RemoveCrew,
                payload,
            });
        },
        getPexelsImagesAction: (value: string, page: number) => {
            return getPexelsImages(value, page);
        },
    };

    return [useBoatState(), actionApis];
};

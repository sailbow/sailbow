import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoat, getAllBoats, getBannerImages, getBoat } from 'modules/boats/Boat.Service';
import { Boat, BoatState, CreateBoat, ModuleId, Photo, WidgetId } from 'modules/boats/Boat.Types';

export enum BoatActionType {
    SetCreateNav,
    SetError,
    SetActiveBoat,
    SetCreateLoading,
    SetGetAllLoading,
    SetGetLoading,
    SetAllBoats,
}

interface PayloadCreateBoat extends CreateBoat {}

interface PayloadSetActiveBoat {
    boat?: Boat;
}

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
        | PayloadSetActiveBoat
        | PayloadError
        | PayloadLoading
        | PayloadSetCreateNav
        | PayloadSetAllBoats;
}

interface BoatProviderProps {
    children: ReactNode;
}

export const initialBoatState: BoatState = {
    activeBoat: undefined,
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
        case BoatActionType.SetActiveBoat: {
            const { boat } = action.payload as PayloadSetActiveBoat;

            return {
                ...boatState,
                activeBoat: boat
                    ? {
                          ...boat,
                          modules: [
                              {
                                  id: ModuleId.Date,
                                  order: 1,
                                  widget: {
                                      id: '11',
                                      widgetId: WidgetId.Date, // will be used to identify which widget
                                      responses: [], // members that have voted
                                      actionRequired: true,
                                      description: 'this is a test widget',
                                      deadline: new Date(), // will be used to send reminders
                                      data: [],
                                      selected: null, // id of the widget data that is voted
                                  },
                              },
                          ],
                      }
                    : undefined,
            };
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
        case BoatActionType.SetGetLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, get: loading } };

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
    getBoat: (boatId: string) => Promise<Boat | null>;
    getBoats: () => Promise<Boat[] | null>;
    removeActiveBoat: () => void;
    getModuleManifestData: (boatId: string, moduleId: ModuleId) => Promise<any | null>;
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
        removeActiveBoat: () => {
            dispatch({ type: BoatActionType.SetActiveBoat, payload: { boat: undefined } });
        },
        getBoat: async (boatId: string) => {
            dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: true } });
            try {
                const response = await getBoat(boatId);

                dispatch({ type: BoatActionType.SetActiveBoat, payload: { boat: response } });
                dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: false } });

                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: false } });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
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
        getModuleManifestData: async (boatId: string, moduleId: ModuleId) => {
            return new Promise<any | null>((res, rej) => {
                switch (moduleId) {
                    case ModuleId.Date:
                        return setTimeout(() => {
                            res(`getModuleManifestData - boatId: ${boatId}, moduleId: ${moduleId}`);
                        }, 1000);
                }
            });
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

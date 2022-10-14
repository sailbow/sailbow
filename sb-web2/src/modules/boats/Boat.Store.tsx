import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoat, getAllBoats, getBannerImages, getBoat } from 'modules/boats/Boat.Service';
import { Boat, BoatState, CreateBoat, ModuleExtended, ModuleName, Photo } from 'modules/boats/Boat.Types';

export enum BoatActionType {
    SetCreateNav,
    SetError,
    SetActiveBoat,
    SetCreateLoading,
    SetGetAllLoading,
    SetGetLoading,
    SetAllBoats,
    SetModuleManifest,
    SetModuleWidget,
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

interface PayloadSetModuleManifest {
    data: any;
    moduleId: string;
}

interface PayloadSetModuleWidget {
    data: any;
    moduleId: string;
}

interface BoatAction {
    type: BoatActionType;
    payload:
        | PayloadCreateBoat
        | PayloadSetActiveBoat
        | PayloadError
        | PayloadLoading
        | PayloadSetCreateNav
        | PayloadSetAllBoats
        | PayloadSetModuleManifest
        | PayloadSetModuleWidget;
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

const getBoatById = (boats: Boat[], boatId: string): Boat => {
    const foundBoat = boats.find((boat) => boat.id === boatId);

    if (!foundBoat) throw Error(`Invalid boatId: ${boatId}`);

    return foundBoat;
};

const getModuleById = (modules: ModuleExtended[], moduleId: string): ModuleExtended => {
    const foundModule = modules.find((module) => module.id === moduleId);

    if (!foundModule) throw Error(`Invalid module: ${moduleId}`);

    return foundModule;
};

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
                                  id: '1',
                                  name: ModuleName.Date,
                                  order: 1,
                                  actionRequired: true,
                                  description: 'this is a test date widget',
                                  deadline: new Date(),
                                  totalVotes: 5,
                                  widget: {
                                      data: [],
                                  },
                              },
                              {
                                  id: '2',
                                  name: ModuleName.Location,
                                  order: 2,
                                  actionRequired: true,
                                  description: 'this is a test location widget',
                                  deadline: new Date(),
                                  totalVotes: 5,
                                  widget: {
                                      data: [],
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
        case BoatActionType.SetModuleManifest: {
            const payload = action.payload as PayloadSetModuleManifest;
            const activeBoat = boatState.activeBoat!;
            const modules = activeBoat.modules;
            const moduleIdx = modules.findIndex((module) => module.id === payload.moduleId);

            if (moduleIdx !== -1) {
                const module = modules[moduleIdx];

                module.manifest = { ...payload.data, dataLoaded: true };
                activeBoat.modules = [...modules];
            }

            return { ...boatState };
        }

        case BoatActionType.SetModuleWidget: {
            const payload = action.payload as PayloadSetModuleManifest;
            const activeBoat = boatState.activeBoat!;
            const modules = activeBoat.modules;
            const moduleIdx = modules.findIndex((module) => module.id === payload.moduleId);

            if (moduleIdx !== -1) {
                const module = modules[moduleIdx];

                module.widget = { data: payload.data, dataLoaded: true };
                activeBoat.modules = [...modules];
            }
            return { ...boatState };
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
    getModuleManifestData: (boatId: string, moduleId: string) => Promise<void>;
    getModuleWidgetData: (boatId: string, moduleId: string) => Promise<void>;
    // getCrewByQuery: (query: string) => Promise<Crew[] | null>;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatch = useBoatDispatch();
    const state = useBoatState();

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
        getModuleManifestData: async (boatId: string, moduleId: string) => {
            return new Promise<any | null>((res, rej) => {
                switch (moduleId) {
                    case '1':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModuleManifest,
                                payload: {
                                    moduleId,
                                    data: { data: 'Sat, 7th Sep - Mon 9th Sep' },
                                },
                            });
                        }, 1000);
                    case '2':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModuleManifest,
                                payload: { moduleId, data: null },
                            });
                        }, 2000);
                }
            });
        },
        getModuleWidgetData: async (boatId: string, moduleId: string) => {
            return new Promise<any | null>((res, rej) => {
                switch (moduleId) {
                    case '1':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModuleWidget,
                                payload: {
                                    moduleId,
                                    data: [],
                                },
                            });
                        }, 1000);
                    case '2':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModuleWidget,
                                payload: { moduleId, data: [] },
                            });
                        }, 2000);
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

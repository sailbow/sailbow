import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoat, getAllBoats, getBannerImages, getBoat } from 'modules/boats/Boat.Service';
import {
    Boat,
    BoatState,
    CreateBoat,
    ModuleName,
    Photo,
    ModuleMode,
    ModuleSettings,
    Module,
    ModuleData,
} from 'modules/boats/Boat.Types';

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
    SetModule,
    SetWidgetMode,
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

interface PayloadSetWidgetMode {
    moduleId: string;
    mode: ModuleMode;
}

interface PayloadSetModule {
    moduleId: string;
    module: Module<any>;
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
        | PayloadSetModuleWidget
        | PayloadSetModule
        | PayloadSetWidgetMode;
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
                          modules: {},
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

        // case BoatActionType.SetModuleWidget: {
        //     const payload = action.payload as PayloadSetModuleManifest;
        //     const activeBoat = boatState.activeBoat!;
        //     const modules = activeBoat.modules;
        //     const moduleIdx = modules.findIndex((module) => module.id === payload.moduleId);

        //     if (moduleIdx !== -1) {
        //         const module = modules[moduleIdx];

        //         module.widget = { ...module.widget, data: payload.data, dataLoaded: true };
        //         activeBoat.modules = [...modules];
        //     }
        //     return { ...boatState };
        // }

        case BoatActionType.SetModule: {
            const { module, moduleId } = action.payload as PayloadSetModule;

            return {
                ...boatState,
                activeBoat: {
                    ...boatState.activeBoat!,
                    modules: {
                        ...boatState.activeBoat!.modules,
                        [moduleId]: module,
                    },
                },
            };
        }

        case BoatActionType.SetWidgetMode: {
            const { mode, moduleId } = action.payload as PayloadSetWidgetMode;

            return {
                ...boatState,
                activeBoat: {
                    ...boatState.activeBoat!,
                    modules: {
                        ...boatState.activeBoat!.modules,
                        [moduleId]: {
                            ...boatState.activeBoat!.modules[moduleId],
                            mode,
                        },
                    },
                },
            };
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
    getModuleData: (boatId: string, moduleId: string) => Promise<void>;
    addModule: (moduleName: ModuleName, moduleForm: any) => void;
    removeModule: (moduleId: string) => void;
    setWidgetMode: (moduleId: string, mode: ModuleMode) => void;
    saveModuleData: <T>(moduleId: string, data: ModuleData<T>[]) => void;
    selectOption: (moduleId: string, optionId: string) => void;
    saveWidgetSettings: (moduleId: string, settings: ModuleSettings) => void;
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
        getModuleData: async (boatId: string, moduleId: string) => {
            return new Promise<any | null>((res, rej) => {
                switch (moduleId) {
                    case '1':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModule,
                                payload: {
                                    moduleId,
                                    module: {
                                        ...state.activeBoat!.modules[moduleId],
                                        data: [],
                                        dataLoaded: true,
                                        loading: false,
                                    },
                                },
                            });
                        }, 1000);
                    case '2':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModule,
                                payload: { moduleId, data: [] },
                            });
                        }, 2000);
                }
            });
        },
        addModule: <T,>(moduleName: ModuleName) => {
            // make api call to add module here
            const newBoat = { ...state.activeBoat! };
            const tempId = (Object.keys(newBoat!.modules).length + 1).toString();

            const module: Module<T> = {
                id: tempId,
                name: moduleName,
                order: Object.keys(newBoat!.modules).length + 1,
                description: '',
                totalVotes: 5,
                dataLoaded: false,
                data: [],
                settings: {
                    allowMultiple: true,
                    anonymousVoting: true,
                },
                loading: true,
                mode: ModuleMode.Edit,
            };

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId: tempId,
                    module,
                },
            });
        },
        saveModuleData: <T,>(moduleId: string, data: ModuleData<T>[]) => {
            const module: Module<T> = state.activeBoat!.modules[moduleId];
            module.data = data;
            module.mode = ModuleMode.View;

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId,
                    module,
                },
            });
            // const newModules = state.activeBoat!.modules;
            // const foundModuleIdx = newModules.findIndex((m) => m.id === moduleId);
            // if (foundModuleIdx !== -1) {
            //     newModules[foundModuleIdx].widget.data = data;
            // }
            // dispatch({
            //     type: BoatActionType.SetModules,
            //     payload: {
            //         modules: newModules,
            //     },
            // });
            // dispatch({
            //     type: BoatActionType.SetWidgetMode,
            //     payload: {
            //         moduleId,
            //         mode: WidgetMode.View,
            //     },
            // });
        },
        setWidgetMode: (moduleId: string, mode: ModuleMode) => {
            dispatch({
                type: BoatActionType.SetWidgetMode,
                payload: {
                    moduleId,
                    mode,
                },
            });
        },
        removeModule: (moduleId: string) => {
            // const modules = state.activeBoat!.modules;
            // const modulesIdx = modules.findIndex((m) => m.id === moduleId);
            // if (modulesIdx !== -1) {
            //     modules.splice(modulesIdx, 1);
            // }
            // dispatch({
            //     type: BoatActionType.SetModules,
            //     payload: {
            //         modules,
            //     },
            // });
        },
        selectOption: (moduleId: string, optionId: string) => {
            // const modules = state.activeBoat!.modules;
            // const module = modules.find((m) => m.id === moduleId);
            // if (module) {
            //     const optionIdx = module.widget.data.findIndex((d) => d.id === optionId);
            //     module.widget.data[optionIdx].selected = true;
            // }
            // dispatch({
            //     type: BoatActionType.SetModules,
            //     payload: {
            //         modules,
            //     },
            // });
        },
        saveWidgetSettings: (moduleId: string, settings: ModuleSettings) => {
            // const modules = state.activeBoat!.modules;
            // const module = modules.find((m) => m.id === moduleId);
            // if (module) {
            //     module.widget.settings = settings;
            // }
            // dispatch({
            //     type: BoatActionType.SetModules,
            //     payload: {
            //         modules,
            //     },
            // });
        },
    };

    return [useBoatState(), actionApis];
};

import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoat, getAllBoats, getBannerImages, getBoat, getCrew } from 'modules/boats/Boat.Service';
import {
    Boat,
    BoatState,
    CreateBoat,
    Photo,
    ModuleMode,
    ModuleSettings,
    Module,
    ModuleData,
    ModuleExtended,
    ModuleType,
    BoatViewMode,
} from 'modules/boats/Boat.Types';
import { useAuthStore } from 'modules/auth/Auth.Store';
import { getModule, upsertModule } from './boat-modules/modules/Modules.Service';

export enum BoatActionType {
    SetError,
    SetActiveBoat,
    SetCreateLoading,
    SetGetAllLoading,
    SetGetLoading,
    SetAllBoats,
    SetModule,
    SetAllModules,
    SetModuleMode,
    SetViewMode,
}

interface PayloadSetActiveBoat {
    boat?: Boat;
}

interface PayloadLoading {
    loading: boolean;
}

interface PayloadSetAllBoats {
    boats: Boat[];
}

interface PayloadError {
    error: any;
}

interface PayloadSetModuleMode {
    moduleId: string;
    mode: ModuleMode;
}

interface PayloadSetModule {
    moduleId: string;
    module: ModuleExtended<any>;
}

interface PayloadSetAllModules {
    modules: ModuleExtended<any>[];
}

interface PayloadSetViewMode {
    mode: BoatViewMode;
}

interface BoatAction {
    type: BoatActionType;
    payload:
        | PayloadSetActiveBoat
        | PayloadError
        | PayloadLoading
        | PayloadSetAllBoats
        | PayloadSetModule
        | PayloadSetModuleMode
        | PayloadSetAllModules
        | PayloadSetViewMode;
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
    viewMode: BoatViewMode.Home,
    boats: [],
};

const BoatStateContext = createContext<BoatState | undefined>(undefined);
const BoatDispatchContext = createContext<Dispatch<BoatAction> | undefined>(undefined);

const boatReducer = (state: BoatState, action: BoatAction): BoatState => {
    switch (action.type) {
        case BoatActionType.SetActiveBoat: {
            const { boat } = action.payload as PayloadSetActiveBoat;

            return {
                ...state,
                activeBoat: boat
                    ? {
                          ...boat,
                      }
                    : undefined,
            };
        }
        case BoatActionType.SetCreateLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...state, loading: { ...state.loading, create: loading } };

            return nextState;
        }
        case BoatActionType.SetError: {
            const payload = action.payload as PayloadError;
            const nextState: BoatState = { ...state, error: { ...payload.error } };

            return nextState;
        }
        case BoatActionType.SetGetAllLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...state, loading: { ...state.loading, getAll: loading } };

            return nextState;
        }
        case BoatActionType.SetGetLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...state, loading: { ...state.loading, get: loading } };

            return nextState;
        }

        case BoatActionType.SetAllBoats: {
            const payload = action.payload as PayloadSetAllBoats;
            const nextState: BoatState = { ...state, boats: payload.boats };

            return nextState;
        }

        case BoatActionType.SetModule: {
            const { module, moduleId } = action.payload as PayloadSetModule;
            const modules = state.activeBoat!.modules;

            const mIdx = modules.findIndex((m) => m.id === moduleId);
            modules[mIdx] = {
                ...module,
            };

            return {
                ...state,
            };
        }

        case BoatActionType.SetModuleMode: {
            const { mode, moduleId } = action.payload as PayloadSetModuleMode;
            const module = state.activeBoat!.modules.find((m) => m.id === moduleId);
            module!.mode = mode;

            return {
                ...state,
            };
        }

        case BoatActionType.SetAllModules: {
            const { modules } = action.payload as PayloadSetAllModules;

            return {
                ...state,
                activeBoat: {
                    ...state.activeBoat!,
                    modules,
                },
            };
        }

        case BoatActionType.SetViewMode: {
            return {
                ...state,
                viewMode: (action.payload as PayloadSetViewMode).mode,
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
    createBoat: (boat: CreateBoat) => Promise<Boat | null>;
    getImages: (value: string, page: number) => Promise<Photo[]>;
    getBoat: (boatId: string) => Promise<Boat | null>;
    getBoats: () => Promise<Boat[] | null>;
    removeActiveBoat: () => void;
    getModuleData: (boatId: string, moduleId: string) => Promise<void>;
    addModule: (moduleType: ModuleType) => void;
    removeModule: (moduleId: string) => void;
    setModuleMode: (moduleId: string, mode: ModuleMode) => void;
    saveModuleData: <T>(moduleId: string, data: ModuleData<T>[]) => void;
    selectOption: (moduleId: string, optionId: string) => void;
    saveWidgetSettings: (moduleId: string, settings: ModuleSettings) => void;
    cancelOptionEdit: (moduleId: string, optionId: string) => void;
    setViewMode: (mode: BoatViewMode) => void;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatch = useBoatDispatch();
    const state = useBoatState();
    const [{ user }] = useAuthStore();

    const actionApis: BoatActionApis = {
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
            // dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: true } });
            try {
                const boatResponse = await getBoat(boatId);
                const crew = await getCrew(boatId);

                const modules: ModuleExtended<any>[] = [];

                boatResponse.modules.forEach((module) => {
                    modules.push({
                        ...module,
                        loading: false,
                        dataLoaded: false,
                        mode: ModuleMode.View,
                        data: [],
                    });
                });

                const boat = {
                    ...boatResponse,
                    crew,
                    modules,
                };

                dispatch({
                    type: BoatActionType.SetActiveBoat,
                    payload: {
                        boat,
                    },
                });

                // dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: false } });

                return boat;
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
            const currentModule = state.activeBoat!.modules.find((m) => m.id === moduleId);

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    module: {
                        ...currentModule!,
                        loading: true,
                    },
                    moduleId,
                },
            });

            const module = await getModule(boatId, moduleId);

            const moduleExt: ModuleExtended<any> = {
                ...currentModule!,
                ...module,
                data: module.data.map((d) => ({ ...d, isEditing: false })),
                dataLoaded: true,
                loading: false,
                actionRequired: true,
                mode: module.data.length ? ModuleMode.View : ModuleMode.Edit,
            };

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    module: moduleExt,
                    moduleId,
                },
            });
        },
        addModule: async <T,>(moduleType: ModuleType) => {
            const newBoat = { ...state.activeBoat! };
            const newId = `new-module-${new Date().getTime()}`;

            // TODO: UPDATE MODULE OBJECT INTERFACE
            const module: Pick<Module<T>, 'name' | 'description' | 'settings' | 'order' | 'data'> & { type: string } = {
                name: moduleType,
                type: moduleType,
                order: 0,
                description: '',
                data: [],
                settings: {
                    allowMultiple: true,
                    anonymousVoting: true,
                    deadline: '',
                },
            };

            newBoat.modules.push({
                ...module,
                id: newId,
                type: moduleType,
                loading: true,
                dataLoaded: true,
                mode: ModuleMode.Edit,
                totalVotes: [],
            });

            dispatch({
                type: BoatActionType.SetAllModules,
                payload: {
                    moduleId: newId,
                    modules: newBoat.modules,
                },
            });

            const response = await upsertModule(newBoat.id, module);

            const newModuleIdx = newBoat.modules.findIndex((m) => m.id === newId);

            // TODO: Remove actionRequired. Should come from backend
            if (newModuleIdx !== -1) {
                newBoat.modules[newModuleIdx] = {
                    ...response,
                    loading: false,
                    dataLoaded: true,
                    mode: ModuleMode.Edit,
                    actionRequired: true,
                };
            }

            dispatch({
                type: BoatActionType.SetAllModules,
                payload: {
                    moduleId: response.id,
                    modules: newBoat.modules,
                },
            });
        },
        saveModuleData: async <T,>(moduleId: string, data: ModuleData<T>[]) => {
            const module = state.activeBoat!.modules.find((m) => m.id === moduleId);
            const dataPayload: Partial<ModuleData<T>>[] = [];

            module!.loading = true;
            module!.data = data;

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId,
                    module: module!,
                },
            });

            data.forEach((dataItem: Partial<ModuleData<T>>) => {
                let newOption: ModuleData<any> = { ...dataItem, author: dataItem.author?.id, votes: [] };

                if (dataItem.id && dataItem.id.startsWith('new-option')) {
                    delete newOption.id;
                }

                delete newOption.isEditing;

                dataPayload.push(newOption);
            });

            const response = await upsertModule(state.activeBoat!.id, {
                id: module!.id,
                data: dataPayload,
                name: module!.name,
                type: module!.name,
                order: module!.order,
                description: module!.description,
                settings: module!.settings,
            });

            const updatedModule: ModuleExtended<T> = {
                ...response,
                loading: false,
                mode: ModuleMode.View,
                actionRequired: true,
            };
            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId,
                    module: updatedModule,
                },
            });
        },
        setModuleMode: (moduleId: string, mode: ModuleMode) => {
            dispatch({
                type: BoatActionType.SetModuleMode,
                payload: {
                    moduleId,
                    mode,
                },
            });
        },
        removeModule: (moduleId: string) => {
            // const modules = { ...state.modules };
            // delete modules[moduleId];
            // dispatch({
            //     type: BoatActionType.SetAllModules,
            //     payload: {
            //         moduleId,
            //         modules,
            //     },
            // });
        },
        selectOption: (moduleId: string, optionId: string) => {
            // api call here
            // const module = { ...state.modules[moduleId] };
            // const optionIdx = module.data.findIndex((d) => d.id === optionId);
            // if (optionIdx !== -1) {
            //     module.data[optionIdx].selected = true;
            // }
            // dispatch({
            //     type: BoatActionType.SetModule,
            //     payload: {
            //         moduleId,
            //         module,
            //     },
            // });
        },
        saveWidgetSettings: (moduleId: string, settings: ModuleSettings) => {
            // const module = state.modules[moduleId];
            // if (module) {
            //     module.settings = settings;
            // }
            // dispatch({
            //     type: BoatActionType.SetModule,
            //     payload: {
            //         moduleId,
            //         module,
            //     },
            // });
        },
        cancelOptionEdit: (moduleId: string, optionId: string) => {
            console.log(state.activeBoat?.modules);
        },
        setViewMode: (mode: BoatViewMode) => {
            dispatch({
                type: BoatActionType.SetViewMode,
                payload: {
                    mode,
                },
            });
        },
    };

    return [useBoatState(), actionApis];
};

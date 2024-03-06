'use client';

import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch, useEffect } from 'react';
import {
    Boat,
    BoatState,
    CreateBoat,
    Photo,
    ModuleMode,
    ModuleSettings,
    Module,
    ModuleOptionExtended,
    ModuleType,
    BoatExtended,
} from '@/modules/boats/Boat.Types';

import { api } from '@/trpc/react';

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
}

interface PayloadSetActiveBoat {
    boat?: BoatExtended;
}

interface PayloadLoading {
    loading: boolean;
}

interface PayloadSetAllBoats {
    boats: BoatExtended[];
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
    module: ModuleOptionExtended;
}

interface PayloadSetAllModules {
    modules: ModuleOptionExtended[];
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
    | PayloadSetAllModules;
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

            const mIdx = modules!.findIndex((m) => m.id.toString() === moduleId);
            modules![mIdx] = {
                ...module,
            };

            return {
                ...state,
            };
        }

        case BoatActionType.SetModuleMode: {
            const { mode, moduleId } = action.payload as PayloadSetModuleMode;
            const mod = state.activeBoat!.modules!.find((m) => m.id.toString() === moduleId);
            mod!.mode = mode;

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
    createBoat: (boat: CreateBoat) => void;
    getImages: (query: string, page: number) => void;
    getBoat: (boatId: number) => void;
    getBoats: () => void;
    removeActiveBoat: () => void;
    getModuleData: (boatId: number, moduleId: number) => void;
    addModule: (moduleType: ModuleType) => void;
    removeModule: (moduleId: number) => void;
    setModuleMode: (moduleId: number, mode: ModuleMode) => void;
    saveModuleData: (moduleId: number, data: ModuleOptionExtended[]) => void;
    selectOption: (moduleId: number, optionId: number) => void;
    saveWidgetSettings: (moduleId: number, settings: ModuleSettings) => void;
    cancelOptionEdit: (moduleId: number, optionId: number) => void;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatch = useBoatDispatch();
    const state = useBoatState();
    const { mutate: createBoatMutation, } = api.dock.createBoat.useMutation({
        onSuccess: (boat) => {
            const newBoat: BoatExtended = {
                ...boat,
                modules: [],
            }
            dispatch({ type: BoatActionType.SetActiveBoat, payload: { boat: newBoat } })
        },
        onMutate: () => dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: true } }),
        onSettled: () => dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: false } }),
        onError: (error) => dispatch({ type: BoatActionType.SetError, payload: { error } })
    })

    const actionApis: BoatActionApis = {
        createBoat: (boat: CreateBoat) => createBoatMutation(boat),
        removeActiveBoat: () => {
            dispatch({ type: BoatActionType.SetActiveBoat, payload: { boat: undefined } });
        },
        getBoat: async (boatId: number) => {
            dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: true } })
            const { status, data } = api.dock.getBoatById.useQuery({
                boatId,
                includeBanner: true,
                includeCrew: true
            });
            useEffect(() => {
                if (status === 'success') {
                    const modules: ModuleOptionExtended[] = [];
                    data.modules.forEach((value: Module) => {
                        modules.push({
                            ...value,
                            loading: false,
                            dataLoaded: false,
                            mode: ModuleMode.View,
                            data: null,
                        })
                    });
                }
            }, [status, data])
            try {
                const boatResponse = await getBoat(boatId);
                const crew = await getCrew(boatId);

                const modules: ModuleOptionExtended<any>[] = [];

                boatResponse.modules.forEach((module: any) => {
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
            const currentModule = state.activeBoat!.modules.find((m: any) => m.id === moduleId);

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

            const mod = await getModule(boatId, moduleId);

            const moduleExt: ModuleOptionExtended<any> = {
                ...currentModule!,
                ...mod,
                data: mod.data.map((d: any) => ({ ...d, isEditing: false })),
                dataLoaded: true,
                loading: false,
                actionRequired: true,
                mode: mod.data.length ? ModuleMode.View : ModuleMode.Edit,
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
            const mod: Pick<Module<T>, 'name' | 'description' | 'settings' | 'order' | 'data'> & { type: string } = {
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
                ...mod,
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

            const response = await upsertModule(newBoat.id, mod);

            const newModuleIdx = newBoat.modules.findIndex((m: any) => m.id === newId);

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
        saveModuleData: async <T,>(moduleId: string, data: ModuleOptionExtended<T>[]) => {
            const mod = state.activeBoat!.modules.find((m: any) => m.id === moduleId);
            const dataPayload: Partial<ModuleOptionExtended<T>>[] = [];

            mod!.loading = true;
            mod!.data = data;

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId,
                    module: mod!,
                },
            });

            data.forEach((dataItem: Partial<ModuleOptionExtended<T>>) => {
                let newOption: ModuleOptionExtended<any> = { ...dataItem, author: dataItem.author?.id, votes: [] };

                if (dataItem.id && dataItem.id.startsWith('new-option')) {
                    delete newOption.id;
                }

                delete newOption.isEditing;

                dataPayload.push(newOption);
            });

            const response = await upsertModule(state.activeBoat!.id, {
                id: mod!.id,
                data: dataPayload,
                name: mod!.name,
                type: mod!.name,
                order: mod!.order,
                description: mod!.description,
                settings: mod!.settings,
            });

            const updatedModule: ModuleOptionExtended<T> = {
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
            // const mods = { ...state.modules };
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
            // const mod = { ...state.modules[moduleId] };
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
            // const mod = state.modules[moduleId];
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
    };

    return [useBoatState(), actionApis];
};

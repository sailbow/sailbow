import { ReactNode, createContext, useReducer, useContext, Dispatch, FC } from 'react';

import { CreateNavMode, SystemState } from './System.Types';

export enum SystemActionType {
    SetPickerNav,
    SetCreateNav,
}

interface PayloadSetPickerNav {
    open: boolean;
}

interface PayloadSetCreateNav {
    open: boolean;
    mode: CreateNavMode;
}

interface SystemAction {
    type: SystemActionType;
    payload?: PayloadSetPickerNav | PayloadSetCreateNav;
}

interface SystemProviderProps {
    children: ReactNode;
}

export const initialSystemState: SystemState = {
    pickerOpen: false,
    createNavMode: CreateNavMode.Create,
    createNavOpen: false,
};

const SystemStateContext = createContext<SystemState | undefined>(undefined);
const SystemDispatchContext = createContext<Dispatch<SystemAction> | undefined>(undefined);

const systemReducer = (state: SystemState, action: SystemAction): SystemState => {
    switch (action.type) {
        case SystemActionType.SetPickerNav: {
            return {
                ...state,
                pickerOpen: (action.payload as PayloadSetPickerNav).open,
            };
        }

        case SystemActionType.SetCreateNav: {
            const { mode, open } = action.payload as PayloadSetCreateNav;

            return {
                ...state,
                createNavMode: mode,
                createNavOpen: open,
            };
        }

        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const SystemProvider: FC<SystemProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(systemReducer, initialSystemState);

    return (
        <SystemStateContext.Provider value={state}>
            <SystemDispatchContext.Provider value={dispatch}>{children}</SystemDispatchContext.Provider>
        </SystemStateContext.Provider>
    );
};

export const useSystemState = (): SystemState => {
    const context = useContext(SystemStateContext);

    if (context === undefined) {
        throw new Error('useSystemState must be within SystemProvider');
    }

    return context;
};

export const useSystemDispatch = (): Dispatch<SystemAction> => {
    const context = useContext(SystemDispatchContext);

    if (context === undefined) {
        throw new Error('useSystemDispatch must be within SystemProvider');
    }

    return context;
};

interface SystemActionApis {
    openPicker: () => void;
    closePicker: () => void;
    openCreateNav: () => void;
    closeCreateNav: () => void;
    openEditNav: () => void;
    closeEditNav: () => void;
}

export const useSystem = (): [SystemState, SystemActionApis] => {
    const dispatch = useSystemDispatch();

    const actionApis: SystemActionApis = {
        openPicker: () => {
            dispatch({
                type: SystemActionType.SetPickerNav,
                payload: { open: true },
            });
        },
        closePicker: () => {
            dispatch({
                type: SystemActionType.SetPickerNav,
                payload: { open: false },
            });
        },
        openCreateNav: () => {
            dispatch({
                type: SystemActionType.SetCreateNav,
                payload: { open: true, mode: CreateNavMode.Create },
            });
        },
        closeCreateNav: () => {
            dispatch({
                type: SystemActionType.SetCreateNav,
                payload: { open: false, mode: CreateNavMode.Create },
            });
        },
        openEditNav: () => {
            dispatch({
                type: SystemActionType.SetCreateNav,
                payload: { open: true, mode: CreateNavMode.Edit },
            });
        },
        closeEditNav: () => {
            dispatch({
                type: SystemActionType.SetCreateNav,
                payload: { open: false, mode: CreateNavMode.Edit },
            });
        },
    };

    return [useSystemState(), actionApis];
};

import { ReactNode, createContext, useReducer, useContext, Dispatch, FC } from 'react';

import { SystemState } from './System.Types';

export enum SystemActionType {
    SetPickerNav,
}

interface PayloadSetPickerNav {
    open: boolean;
}

interface SystemAction {
    type: SystemActionType;
    payload?: PayloadSetPickerNav;
}

interface SystemProviderProps {
    children: ReactNode;
}

export const initialSystemState: SystemState = {
    pickerOpen: false,
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
    };

    return [useSystemState(), actionApis];
};

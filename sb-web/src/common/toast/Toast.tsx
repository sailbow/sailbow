import React, { createContext, Dispatch, FunctionComponent, ReactNode, useContext, useReducer } from 'react';

import { Flex, Icon, Text } from '@chakra-ui/react';
import { BsExclamation as Exclamation } from 'react-icons/bs';
import { IoCloseOutline as Close, IoCheckmarkOutline as Checkmark } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';

import { Log } from 'util/Logger';

import 'react-toastify/dist/ReactToastify.css';
import 'common/toast/Toast.scss';

const TOAST_DURATION = 5000;

enum ToastType {
    Success = 'MESSAGE_SUCCESS',
    Error = 'MESSAGE_ERROR',
    Warning = 'MESSAGE_WARNING',
}

export interface Toast {
    type?: ToastType;
    text?: string;
    visible: boolean;
}

export enum ToastActionType {
    ShowSuccess = 'SHOW_SUCCESS',
    ShowError = 'SHOW_ERROR',
    ShowWarning = 'SHOW_WARNING',
    Hide = 'HIDE',
}

export interface ToastAction {
    type: ToastActionType;
    text?: string;
}

interface ToastProviderProps {
    children: ReactNode;
}

const ToastStateContext = createContext<Toast | undefined>(undefined);
const ToastDispatchContext = createContext<Dispatch<ToastAction> | undefined>(undefined);

const messageReducer = (message: Toast, action: ToastAction): Toast => {
    const log = new Log();
    log.group(action.type);
    log.prev(message);

    switch (action.type) {
        case ToastActionType.ShowSuccess: {
            const nextState = { type: ToastType.Success, text: action.text, visible: true };
            log.next(nextState);
            return nextState;
        }

        case ToastActionType.ShowError: {
            const nextState = { type: ToastType.Error, text: action.text, visible: true };
            log.next(nextState);
            return nextState;
        }

        case ToastActionType.ShowWarning: {
            const nextState = { type: ToastType.Warning, text: action.text, visible: true };
            log.next(nextState);
            return nextState;
        }

        case ToastActionType.Hide: {
            const nextState = { visible: false };
            log.next(nextState);
            return nextState;
        }

        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const ToastProvider: FunctionComponent<ToastProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(messageReducer, { visible: false });

    return (
        <ToastStateContext.Provider value={state}>
            <ToastDispatchContext.Provider value={dispatch}>{children}</ToastDispatchContext.Provider>
        </ToastStateContext.Provider>
    );
};

const useToastState = (): Toast => {
    const context = useContext(ToastStateContext);

    if (context === undefined) {
        throw new Error('UseToastState must be used within ToastProvider');
    }

    return context;
};

const useToastDispatch = (): Dispatch<ToastAction> => {
    const context = useContext(ToastDispatchContext);

    if (context === undefined) {
        throw new Error('UseToastState must be used within ToastProvider');
    }

    return context;
};

export const useToast = (): [Toast, Dispatch<ToastAction>] => {
    return [useToastState(), useToastDispatch()];
};

export const ToastBar = (): JSX.Element | null => {
    const [message] = useToast() as [Toast, Dispatch<ToastAction>];

    if (!message || !message.type) return null;

    const Container: FunctionComponent = ({ children }: any) => <>{children}</>;

    switch (message.type) {
        case ToastType.Success: {
            toast(
                <Container>
                    <Flex alignItems="center">
                        <Icon as={Checkmark} w={6} h={6} zIndex="2" color="white" />
                        <Text pl="4" fontSize="sm">
                            {message.text}
                        </Text>
                    </Flex>
                </Container>,
                { toastId: 'success-toast', className: 'success' },
            );
            break;
        }
        case ToastType.Error: {
            toast(
                <Container>
                    <Flex alignItems="center">
                        <Icon as={Close} w={6} h={6} zIndex="2" color="white" />
                        <Text pl="4" fontSize="sm">
                            {message.text}
                        </Text>
                    </Flex>
                </Container>,
                { toastId: 'error-toast', className: 'error' },
            );
            break;
        }
        case ToastType.Warning: {
            toast(
                <Container>
                    <Flex alignItems="center">
                        <Icon as={Exclamation} w={6} h={6} zIndex="2" color="white" />
                        <Text pl="4" fontSize="sm">
                            {message.text}
                        </Text>
                    </Flex>
                </Container>,
                { toastId: 'warning-toast', className: 'warning' },
            );
            break;
        }
        default:
            throw new Error('Invalid message type');
    }
    return (
        <>
            <ToastContainer
                hideProgressBar
                className="sb-toast"
                autoClose={TOAST_DURATION}
                position="bottom-left"
                closeButton={false}
            />
        </>
    );
};

// From https://chakra-templates.dev/templates/navigation/sidebar/sidebarWithHeader

import { ReactNode, createContext, useReducer, useContext, Dispatch, FC } from 'react';
import { Box, useColorModeValue, Drawer, DrawerContent } from '@chakra-ui/react';

import { SidebarContent } from './sidebar-content/SidebarContent';
import { LayoutStoreState, SidebarWidth } from './Layout.Types';

export enum LayoutStoreActionType {
    SetMobileNavOpen,
}

interface PayloadSetMobileNavOpen {
    open: boolean;
}

interface LayoutStoreAction {
    type: LayoutStoreActionType;
    payload?: PayloadSetMobileNavOpen;
}

interface LayoutStoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: LayoutStoreState = {
    mobileNavOpen: false,
};

const LayoutStoreStateContext = createContext<LayoutStoreState | undefined>(undefined);
const LayoutStoreDispatchContext = createContext<Dispatch<LayoutStoreAction> | undefined>(undefined);

const storeReducer = (state: LayoutStoreState, action: LayoutStoreAction): LayoutStoreState => {
    switch (action.type) {
        case LayoutStoreActionType.SetMobileNavOpen:
            return {
                ...state,
                mobileNavOpen: (action.payload as PayloadSetMobileNavOpen).open,
            };
        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const LayoutStoreProvider: FC<LayoutStoreProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, initialStoreState);

    return (
        <LayoutStoreStateContext.Provider value={state}>
            <LayoutStoreDispatchContext.Provider value={dispatch}>{children}</LayoutStoreDispatchContext.Provider>
        </LayoutStoreStateContext.Provider>
    );
};

export const useLayoutStoreState = (): LayoutStoreState => {
    const context = useContext(LayoutStoreStateContext);

    if (context === undefined) {
        throw new Error('useLayoutStoreState must be within LayoutStoreProvider');
    }

    return context;
};

export const useLayoutStoreDispatch = (): Dispatch<LayoutStoreAction> => {
    const context = useContext(LayoutStoreDispatchContext);

    if (context === undefined) {
        throw new Error('useLayoutStoreDispatch must be within LayoutStoreProvider');
    }

    return context;
};

interface LayoutStoreActionApis {
    openMobileNav: () => void;
    closeMobileNav: () => void;
}

export const useLayoutStore = (): [LayoutStoreState, LayoutStoreActionApis] => {
    const dispatch = useLayoutStoreDispatch();

    const actionApis: LayoutStoreActionApis = {
        openMobileNav: () => {
            dispatch({ type: LayoutStoreActionType.SetMobileNavOpen, payload: { open: true } });
        },
        closeMobileNav: () => {
            dispatch({ type: LayoutStoreActionType.SetMobileNavOpen, payload: { open: false } });
        },
    };

    return [useLayoutStoreState(), actionApis];
};

export default function Layout({ children }: { children: ReactNode }) {
    const [{ mobileNavOpen }, { closeMobileNav }] = useLayoutStore();

    return (
        <Box minH="100vh" h="100%" className="sb-layout">
            <SidebarContent onClose={() => closeMobileNav} display={{ base: 'none', md: 'block' }} />
            <Drawer
                autoFocus={false}
                isOpen={mobileNavOpen}
                placement="left"
                onClose={closeMobileNav}
                returnFocusOnClose={false}
                onOverlayClick={closeMobileNav}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={closeMobileNav} />
                </DrawerContent>
            </Drawer>

            <Box className="sb-sidebar-children" ml={{ base: 0, md: SidebarWidth }} height="100%">
                {children}
            </Box>
        </Box>
    );
}

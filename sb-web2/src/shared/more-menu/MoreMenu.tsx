import { FC, ReactNode, useMemo } from 'react';

import { Menu, MenuButton, MenuList, useBreakpointValue, IconButton, Box, Button, MenuItem } from '@chakra-ui/react';

import { useSystem } from 'modules/system/System.Store';
import { SbMoreIcon } from 'shared/icons/Icons';
import { RoleGuardProps, withRoleGuard } from 'shared/role/RoleGuard';

export interface MoreMenuOption extends RoleGuardProps {
    id: string;
    label: string;
    icon: ReactNode;
    action?: () => void;
    props?: any;
}

interface Props {
    customButton?: ReactNode;
    options: MoreMenuOption[];
    children?: ReactNode;
}

const GuardedMenuItem = withRoleGuard(MenuItem);
const GuardedOptionButton = withRoleGuard(Button);

export const MoreMenu: FC<Props> = ({ children, customButton, options }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [, { openMoreMenuDrawer, closeMoreMenuDrawer }] = useSystem();

    const drawerOptions = useMemo(
        () => (
            <>
                {options.map((option) => (
                    <GuardedOptionButton
                        role={option.role}
                        acceptedRoles={option.acceptedRoles}
                        key={option.id}
                        variant="icon"
                        justifyContent="flex-start"
                        w="100%"
                        borderRadius="0"
                        colorScheme="gray"
                        leftIcon={<>{option.icon}</>}
                        onClick={() => {
                            closeMoreMenuDrawer();
                            if (option.action) {
                                option.action();
                            }
                        }}
                        {...option.props}
                    >
                        {option.label}
                    </GuardedOptionButton>
                ))}
            </>
        ),
        [options, closeMoreMenuDrawer],
    );

    const MobileRenderer = () => {
        return (
            <Box onClick={() => openMoreMenuDrawer(drawerOptions)}>
                {customButton ? (
                    <>{customButton}</>
                ) : (
                    <IconButton
                        aria-label="more-menu-options"
                        icon={<SbMoreIcon />}
                        variant="ghost"
                        colorScheme="gray"
                        fontSize="2xl"
                        mr="-2"
                    />
                )}
            </Box>
        );
    };

    const MenuRenderer = () => {
        return isMobile ? (
            <MobileRenderer />
        ) : (
            <Menu isLazy lazyBehavior="unmount">
                {customButton ? (
                    <>{customButton}</>
                ) : (
                    <MenuButton
                        as={IconButton}
                        aria-label="more-menu-options"
                        icon={<SbMoreIcon />}
                        variant="ghost"
                        colorScheme="gray"
                        fontSize="2xl"
                        mr="-4"
                    />
                )}
                <MenuList>
                    {options.map((option) => (
                        <GuardedMenuItem
                            role={option.role}
                            acceptedRoles={option.acceptedRoles}
                            key={option.id}
                            icon={<>{option.icon}</>}
                            onClick={() => {
                                if (option.action) option.action();
                            }}
                            {...option.props}
                        >
                            {option.label}
                        </GuardedMenuItem>
                    ))}
                </MenuList>
            </Menu>
        );
    };

    return children ? <>{isMobile ? <MobileRenderer /> : <>{children}</>} </> : <MenuRenderer />;
};

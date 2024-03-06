import { FC } from 'react';

import { Button, Flex, HStack } from '@chakra-ui/react';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { ProfileIcon } from '@/modules/profile/profile-icon/ProfileIcon';
import { useSystem } from '@/modules/system/System.Store';
import { Notifications } from 'shared/notifications/Notifications';
import { Routes } from 'router/Router.Types';
import { SbPlusIcon } from 'shared/icons/Icons';
import { NavbarProps } from 'shared/navbar/Navbar.Types';

import 'shared/navbar/Navbar.scss';

export const NavbarDesktop: FC<NavbarProps> = ({ onRoute }) => {
    const [, { openCreateNav }] = useSystem();

    return (
        <Flex
            className="sb-navbar desktop"
            justifyContent="space-between"
            alignItems="center"
            px={{ base: 2, md: 4 }}
            py="2"
            bg="white"
        >
            <HStack alignItems="center" spacing="4" pl="2">
                <Logo className="logo" onClick={() => onRoute(Routes.Private.Boats)} />
            </HStack>
            <Flex alignItems="center" justifyContent="space-between" gap="4">
                <Button rightIcon={<SbPlusIcon />} onClick={openCreateNav} display={{ base: 'none', md: 'flex' }}>
                    Start Boat
                </Button>
                <Notifications />
                <ProfileIcon />
            </Flex>
        </Flex>
    );
};

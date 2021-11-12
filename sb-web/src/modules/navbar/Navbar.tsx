import React, { FunctionComponent, useEffect, useState } from 'react';

import { Flex, Button, HStack } from '@chakra-ui/react';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { UnAuthenticatedNavbar } from 'modules/navbar/UnauthenticatedNavbar';
import { Notification } from 'modules/notifications/Notification';
import { ProfileIcon } from 'profile/profile-icon/ProfileIcon';
import { Routes } from 'router/Router.Types';
import { Boat, SbClockIcon, SbFeedIcon, SbPlusIcon } from 'util/icons/Icons';

import 'modules/navbar/Navbar.scss';

interface Props {
    isAuth: boolean;
}

export const Navbar: FunctionComponent<Props> = ({ isAuth }) => {
    const [navbarBg, setNavbarBg] = useState<boolean>(false);

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY < 10) {
                setNavbarBg(false);
            } else {
                setNavbarBg(true);
            }
        });
    }, []);

    const onRoute = (path: string) => {
        if (window.location.pathname !== path) window.location.href = path;
    };

    return (
        <Flex
            className="sb-navbar"
            justifyContent="space-between"
            alignItems="center"
            px={{ base: '4', sm: '8' }}
            bg={navbarBg ? 'white' : 'transparent'}
            transition="all 0.25s ease-in-out"
            boxShadow={navbarBg ? 'sm' : 'none'}
        >
            {isAuth ? (
                <>
                    <HStack alignItems="center" spacing="2">
                        <Logo className="logo" onClick={() => onRoute(Routes.Private.Home)} />
                        <Button
                            variant={window.location.pathname === Routes.Private.Home ? 'solid' : 'ghost'}
                            colorScheme="gray"
                            leftIcon={<Boat />}
                            onClick={() => onRoute(Routes.Private.Home)}
                        >
                            Boats
                        </Button>
                        <Button variant="ghost" colorScheme="gray" leftIcon={<SbFeedIcon />}>
                            Feed
                        </Button>
                        <Button variant="ghost" colorScheme="gray" leftIcon={<SbClockIcon />}>
                            Memories
                        </Button>
                    </HStack>
                    <HStack alignItems="center">
                        <Button leftIcon={<SbPlusIcon />} onClick={() => onRoute(Routes.Private.Create)}>
                            Start Boat
                        </Button>
                        <Notification />
                        <ProfileIcon />
                    </HStack>
                </>
            ) : (
                <UnAuthenticatedNavbar navbarBg={navbarBg} onRoute={onRoute} />
            )}
        </Flex>
    );
};

import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Flex, IconButton, HStack } from '@chakra-ui/react';
import { matchPath } from 'react-router-dom';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { Menu } from 'components/menu/Menu';
import { UnAuthenticatedNavbar } from 'modules/navbar/UnauthenticatedNavbar';
import { Notification } from 'modules/notifications/Notification';
import { ProfileIcon } from 'profile/profile-icon/ProfileIcon';
import { Routes } from 'router/Router.Types';
import { SbClockIcon, SbFeedIcon, SbBoatIcon, SbPlusIcon } from 'util/icons/Icons';

import 'modules/navbar/Navbar.scss';

interface Props {
    isAuth: boolean;
}

enum LinkLabels {
    Boats = '/boats',
    Feed = '/feeds',
    Memories = '/memories',
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

    const getActiveState = (link: LinkLabels): 'solid' | 'ghost' => {
        const check = (currentLink: string) => {
            // eslint-disable-next-line
            if (!!matchPath(window.location.pathname, currentLink)) {
                return 'solid';
            }
            return 'ghost';
        };

        switch (link) {
            case LinkLabels.Boats:
                return check(Routes.Private.Boats);
            case LinkLabels.Feed:
                return check(Routes.Private.Boats);
            case LinkLabels.Memories:
                return check(Routes.Private.Boats);
            default:
                return 'ghost';
        }
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
                    <HStack alignItems="center" spacing="4">
                        <Logo className="logo" onClick={() => onRoute(Routes.Private.Boats)} />
                        <Box display={{ base: 'none', md: 'flex' }}>
                            <Button
                                variant={getActiveState(LinkLabels.Boats)}
                                colorScheme="gray"
                                leftIcon={<SbBoatIcon />}
                                onClick={() => onRoute(Routes.Private.Boats)}
                            >
                                Boats
                            </Button>
                            <Button variant="ghost" colorScheme="gray" leftIcon={<SbFeedIcon />}>
                                Feed
                            </Button>
                            <Button variant="ghost" colorScheme="gray" leftIcon={<SbClockIcon />}>
                                Memories
                            </Button>
                        </Box>
                    </HStack>
                    <HStack alignItems="center">
                        <Button
                            rightIcon={<SbPlusIcon />}
                            onClick={() => onRoute(Routes.Private.Create)}
                            display={{ base: 'none', md: 'flex' }}
                        >
                            Start Boat
                        </Button>
                        <Notification display={{ base: 'none', md: 'block' }} />
                        <ProfileIcon display={{ base: 'none', md: 'block' }} />

                        {/* MOBILE NAV ITEMS START */}

                        <IconButton aria-label="add" icon={<SbPlusIcon />} display={{ base: 'flex', md: 'none' }} />
                        <Menu display={{ base: 'block', md: 'none' }} />

                        {/* MOBILE NAV ITEMS END */}
                    </HStack>
                </>
            ) : (
                <UnAuthenticatedNavbar navbarBg={navbarBg} onRoute={onRoute} />
            )}
        </Flex>
    );
};

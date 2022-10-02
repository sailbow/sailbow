import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Flex, IconButton, HStack, Link } from '@chakra-ui/react';
import { matchPath } from 'react-router-dom';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { useBoat } from 'modules/boats/Boat.Store';
import { ProfileIcon } from 'modules/profile/profile-icon/ProfileIcon';
import { Notifications } from 'shared/notifications/Notifications';
import { Menu } from 'shared/menu/Menu';
import { Routes } from 'router/Router.Types';
import { SbClockIcon, SbFeedIcon, SbBoatIcon, SbPlusIcon } from 'shared/icons/Icons';

import './Navbar.scss';

enum LinkLabels {
    Boats = '/boats',
    Feed = '/feeds',
    Memories = '/memories',
}

export const Navbar: FunctionComponent = () => {
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

    const [, { openCreateBoat }] = useBoat();

    const getActiveState = (link: LinkLabels): 'solid' | 'ghost' => {
        const check = (currentLink: string) => {
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
            p="4"
            bg={navbarBg ? 'white' : 'transparent'}
            transition="all 0.25s ease-in-out"
            boxShadow={navbarBg ? 'sm' : 'none'}
            id="sb-navbar"
        >
            <HStack alignItems="center" spacing="4" pl="2">
                <Logo className="logo" onClick={() => onRoute(Routes.Private.Boats)} />
                <Box display="flex" gap="2">
                    <Link variant="navbar" fontSize="lg">
                        Boats
                    </Link>
                    {/* <Button
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
                    </Button> */}
                </Box>
            </HStack>
            <Flex alignItems="center" justifyContent="space-between" gap="4">
                <Button
                    rightIcon={<SbPlusIcon />}
                    onClick={openCreateBoat}
                    size="lg"
                    display={{ base: 'none', md: 'flex' }}
                >
                    Start Boat
                </Button>
                <Notifications display={{ base: 'none', md: 'block' }} />
                <ProfileIcon display={{ base: 'none', md: 'block' }} />

                {/* MOBILE NAV ITEMS START */}

                <IconButton
                    aria-label="add"
                    icon={<SbPlusIcon />}
                    display={{ base: 'flex', md: 'none' }}
                    size="lg"
                    onClick={openCreateBoat}
                />
                <Box mr="-3">
                    <Menu display={{ base: 'block', md: 'none' }} />
                </Box>

                {/* MOBILE NAV ITEMS END */}
            </Flex>
        </Flex>
    );
};

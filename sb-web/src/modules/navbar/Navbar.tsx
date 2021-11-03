import React, { FunctionComponent, useEffect, useState } from 'react';

import { Flex, Button, HStack } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { UnAuthenticatedNavbar } from 'modules/navbar/UnauthenticatedNavbar';
import { ProfileIcon } from 'modules/profile/profile-icon/ProfileIcon';
import { Plus } from 'util/Icons';
import { Routes } from 'util/Routing';

import 'modules/navbar/Navbar.scss';

interface Props {
    isAuth: boolean;
}

export const Navbar: FunctionComponent<Props> = ({ isAuth }) => {
    const history = useHistory();
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
        history.push(path);
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
                    <Logo className="logo" onClick={() => onRoute(Routes.Private.Home)} />
                    <HStack alignItems="center" spacing="8">
                        <Button leftIcon={<Plus />}>Create Boat</Button>
                        <Button variant="link">Boats</Button>
                        <Button variant="link">Memories</Button>
                        <Button variant="link">Notifications</Button>
                        <ProfileIcon />
                    </HStack>
                </>
            ) : (
                <UnAuthenticatedNavbar navbarBg={navbarBg} />
            )}
        </Flex>
    );
};

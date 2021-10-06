import React, { FunctionComponent, useEffect, useState } from 'react';

import { Flex, Button, HStack } from '@chakra-ui/react';
import { HiArrowRight as RightIcon } from 'react-icons/hi';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';

import 'modules/navbar/Navbar.scss';

interface Props {
    isAuth: boolean;
}

export const Navbar: FunctionComponent<Props> = () => {
    const [navbarBg, setNavbarBg] = useState<boolean>(false);

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY < 25) setNavbarBg(false);
            else setNavbarBg(true);
        });
    }, []);
    return (
        <Flex
            className="sb-navbar"
            justifyContent="space-between"
            alignItems="center"
            px={{ base: '3', sm: '8' }}
            bg={navbarBg ? 'white' : 'transparent'}
            transition="all 0.25s ease-in-out"
            boxShadow={navbarBg ? 'sm' : 'none'}
        >
            <Logo className="logo" />
            <HStack spacing={{ base: '4', sm: '8' }}>
                <Button variant="link" display={{ base: 'none', sm: 'block' }}>
                    About
                </Button>
                <Button variant="link" display={{ base: 'none', sm: 'block' }}>
                    Contact
                </Button>
                <Button variant="link" display={{ base: 'none', sm: 'block' }}>
                    FAQ
                </Button>
                {navbarBg && (
                    <Button size="sm" rightIcon={<RightIcon />}>
                        Start
                    </Button>
                )}
            </HStack>
        </Flex>
    );
};

Navbar.defaultProps = {
    isAuth: false,
};

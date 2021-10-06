import React, { FunctionComponent, useEffect, useState } from 'react';

import { Flex, Text, Button, HStack, IconButton, VStack, Box } from '@chakra-ui/react';
import { HiArrowRight as RightIcon } from 'react-icons/hi';
import { CgMenuRight as Menu } from 'react-icons/cg';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';

import 'modules/navbar/Navbar.scss';

interface Props {
    isAuth: boolean;
}

export const Navbar: FunctionComponent<Props> = () => {
    const [navbarBg, setNavbarBg] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY < 25) {
                setNavbarBg(false);
            } else {
                setNavbarBg(true);
            }
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
            <IconButton
                icon={<Menu />}
                aria-label="menu"
                variant="ghost"
                color="gray.600"
                fontSize="2xl"
                onClick={() => setMenuOpen(!menuOpen)}
                display={{ base: 'block', sm: 'none' }}
            />
            <Logo className="logo" />
            <HStack spacing="8" display={{ base: 'none', sm: 'flex' }}>
                <Button variant="link" display={{ base: 'none', sm: 'block' }}>
                    About
                </Button>
                <Button variant="link" display={{ base: 'none', sm: 'block' }}>
                    Contact
                </Button>
                <Button variant="link" display={{ base: 'none', sm: 'block' }}>
                    FAQ
                </Button>
                {navbarBg ? (
                    <Button size="sm" rightIcon={<RightIcon />}>
                        Start
                    </Button>
                ) : (
                    <></>
                )}
            </HStack>
            <Box display={{ base: 'block', sm: 'none' }}>
                <Button size="sm" rightIcon={<RightIcon />}>
                    Start
                </Button>
                <Box
                    bg="white"
                    w="100%"
                    top={menuOpen ? '68px' : '-400px'}
                    position="absolute"
                    left="0"
                    px="3"
                    overflow="hidden"
                    transition="top 0.5s ease-in-out"
                    boxShadow="sm"
                    zIndex="-1"
                    py="4"
                >
                    <VStack spacing="8">
                        <Button variant="link">About</Button>
                        <Button variant="link">Contact</Button>
                        <Button variant="link">FAQ</Button>
                    </VStack>
                </Box>
            </Box>
        </Flex>
    );
};

Navbar.defaultProps = {
    isAuth: false,
};

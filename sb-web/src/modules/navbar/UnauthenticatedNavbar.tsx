import React, { FunctionComponent, useState } from 'react';

import { Button, HStack, IconButton, VStack, Box, Text } from '@chakra-ui/react';

import { NAVBAR_HEIGHT } from 'theme/ThemeVariables';
import { SbRightArrowIcon, SbMenuIcon, Logo } from 'util/icons/Icons';
import { Routes } from 'router/Router.Types';

interface Props {
    navbarBg: boolean;
    onRoute: (path: string) => void;
}

const PublicNavItems = [
    {
        name: 'About',
        path: Routes.Whitelisted.AboutUs,
    },
    {
        name: 'Contact',
        path: Routes.Whitelisted.Contact,
    },
    {
        name: 'FAQ',
        path: Routes.Whitelisted.FAQ,
    },
];

export const UnAuthenticatedNavbar: FunctionComponent<Props> = ({ navbarBg, onRoute }) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    return (
        <>
            <IconButton
                icon={<SbMenuIcon />}
                aria-label="menu"
                variant="ghost"
                color="gray.600"
                fontSize="2xl"
                onClick={() => setMenuOpen(!menuOpen)}
                display={{ base: 'block', sm: 'none' }}
            />
            <Logo className="logo" onClick={() => onRoute(Routes.Public.Landing)} />
            <HStack spacing="8" display={{ base: 'none', sm: 'flex' }}>
                {PublicNavItems.map((item) => (
                    <Button
                        variant="link"
                        display={{ base: 'none', sm: 'block' }}
                        key={item.name}
                        onClick={() => onRoute(item.path)}
                    >
                        {item.name}
                    </Button>
                ))}

                {navbarBg ? (
                    <Button
                        rightIcon={<SbRightArrowIcon />}
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <Text>Start Sailing</Text>
                    </Button>
                ) : (
                    <></>
                )}
            </HStack>
            <Box display={{ base: 'block', sm: 'none' }}>
                <Button size="sm" borderRadius="xl" rightIcon={<SbRightArrowIcon />}>
                    Start
                </Button>
                <Box
                    bg="white"
                    w="100%"
                    h={menuOpen ? '150px' : '0px'}
                    position="absolute"
                    top={NAVBAR_HEIGHT}
                    left="0"
                    px="3"
                    overflow="hidden"
                    transition="all 0.2s ease-in-out"
                    boxShadow="sm"
                    zIndex="-1"
                    py={menuOpen ? '4' : '0'}
                >
                    <VStack spacing="8">
                        {PublicNavItems.map((item) => (
                            <Button variant="link" key={item.name} onClick={() => onRoute(item.path)}>
                                {item.name}
                            </Button>
                        ))}
                    </VStack>
                </Box>
            </Box>
        </>
    );
};

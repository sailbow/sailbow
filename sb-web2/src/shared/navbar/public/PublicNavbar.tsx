import React, { FunctionComponent, useState } from 'react';

import { Button, HStack, IconButton, VStack, Box, Text, Flex } from '@chakra-ui/react';

import { SbRightArrowIcon, SbMenuIcon, Logo } from 'shared/icons/Icons';
import { Routes } from 'router/Router.Types';

const NAVBAR_HEIGHT = '68px';

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

export const PublicNavbar: FunctionComponent = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const onRoute = (path: string) => {
        window.location.href = path;
    };

    return (
        <Flex w="100%" justifyContent="space-between" alignItems="center" p="4">
            <Logo width="36px" height="36px" onClick={() => onRoute(Routes.Public.Landing)} />
            <HStack spacing="4" display={{ base: 'none', md: 'flex' }}>
                {PublicNavItems.map((item) => (
                    <Button
                        variant="menu-link"
                        display={{ base: 'none', sm: 'block' }}
                        key={item.name}
                        onClick={() => onRoute(item.path)}
                    >
                        {item.name}
                    </Button>
                ))}

                <Button
                    size="lg"
                    rightIcon={<SbRightArrowIcon />}
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <Text>Start Sailing</Text>
                </Button>
            </HStack>
        </Flex>
    );
};

import React, { FunctionComponent } from 'react';
import { Flex, Button, HStack } from '@chakra-ui/react';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';

import 'modules/navbar/Navbar.scss';

interface Props {
    isAuth: boolean;
}

export const Navbar: FunctionComponent<Props> = () => {
    return (
        <Flex className="sb-navbar" justifyContent="space-between" alignItems="center" px={{ base: '3', sm: '8' }}>
            <Logo className="logo" />
            <HStack spacing={{ base: '4', sm: '8' }}>
                <Button variant="link" display={{ base: 'none', sm: 'block' }}>
                    Terms & Conditions
                </Button>
                <Button variant="link" display={{ base: 'block', sm: 'none' }}>
                    T & C
                </Button>
                <Button variant="link">Policy</Button>
            </HStack>
        </Flex>
    );
};

Navbar.defaultProps = {
    isAuth: false,
};

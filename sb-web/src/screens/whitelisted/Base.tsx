import React, { FunctionComponent, ReactElement } from 'react';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { Footer } from 'modules/footer/Footer';
import { RightIcon } from 'util/Icons';
import { Routes } from 'util/Routing';

import 'screens/whitelisted/Base.scss';

interface Props {
    children: ReactElement | ReactElement[];
    title: string;
    subtitle?: string;
}

export const BaseNavbar: FunctionComponent = () => {
    return (
        <Flex
            bg="white"
            justifyContent="space-between"
            px={{ base: '4', sm: '8' }}
            alignItems="center"
            className="sb-base-navbar"
            boxShadow="sm"
        >
            <Logo className="logo" />
            <Button
                rightIcon={<RightIcon />}
                onClick={() => {
                    window.location.href = Routes.Public.Landing;
                }}
            >
                <Text pr="4">Start Sailing</Text>
            </Button>
        </Flex>
    );
};

export const Base: FunctionComponent<Props> = ({ title, children, subtitle }) => {
    return (
        <>
            <Box p="8" className="container">
                <Heading>{title}</Heading>
                {subtitle && <Text fontWeight="normal">{subtitle}</Text>}
                <Box pt="16">{children}</Box>
            </Box>
            <Footer />
        </>
    );
};

Base.defaultProps = {
    subtitle: '',
};

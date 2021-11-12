import React, { FunctionComponent } from 'react';

import { Flex } from '@chakra-ui/react';

import { AuthCard } from 'auth/AuthCard';

import 'util/landing/Landing.scss';

export const Landing: FunctionComponent = () => {
    return (
        <Flex className="sb-landing">
            <Flex w="65%" className="left-container" h="100%" display={{ base: 'none', lg: 'block' }} />
            <Flex
                w={{ base: '100%', lg: '45%' }}
                className="right-container"
                bgColor="white"
                justifyContent="center"
                alignItems="center"
            >
                <AuthCard />
            </Flex>
        </Flex>
    );
};

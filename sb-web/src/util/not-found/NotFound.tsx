import React, { FunctionComponent } from 'react';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import { ReactComponent as NotFoundSVG } from 'assets/404.svg';
import { SbRightArrowIcon } from 'util/icons/Icons';
import { Routes } from 'router/Router.Types';

export const NotFound: FunctionComponent = () => {
    return (
        <>
            <Flex
                className="container"
                justifyContent="center"
                alignItems="center"
                flexDir={{ base: 'column', md: 'row' }}
                pb="10"
                pt="36"
            >
                <Box textAlign={{ base: 'center', md: 'start' }}>
                    <Heading>Page Not Found :(</Heading>
                    <Text fontWeight="normal" pt="2">
                        Looks like the page you are looking for does not exist.
                    </Text>
                    <Button
                        mt="8"
                        rightIcon={<SbRightArrowIcon />}
                        size="lg"
                        onClick={() => {
                            window.location.pathname = Routes.Public.Landing;
                        }}
                    >
                        <Text pr="8">Back to Home</Text>
                    </Button>
                </Box>
                <Box mt={{ base: '20', md: '0' }} ml={{ base: '0', md: '20' }}>
                    <NotFoundSVG width="100%" />
                </Box>
            </Flex>
        </>
    );
};

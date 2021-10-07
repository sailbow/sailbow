import React, { FunctionComponent } from 'react';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import { ReactComponent as NotFoundSVG } from 'assets/404.svg';
import { Footer } from 'modules/footer/Footer';
import { RightIcon } from 'util/Icons';
import { Routes } from 'util/Routing';

export const NotFound: FunctionComponent = () => {
    return (
        <>
            <Flex
                className="container"
                justifyContent="center"
                alignItems="center"
                flexDir={{ base: 'column', md: 'row' }}
                my="20"
            >
                <Box>
                    <Heading>Page Not Found :(</Heading>
                    <Text fontWeight="normal" pt="4">
                        Looks like the page you are looking for does not exist.
                    </Text>
                    <Button
                        mt="8"
                        rightIcon={<RightIcon />}
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
            <Footer />
        </>
    );
};

import React, { FunctionComponent } from 'react';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import { ReactComponent as NotFoundSVG } from 'assets/404.svg';

export const NotFound: FunctionComponent = () => {
    return (
        <Flex
            className="container"
            justifyContent="center"
            alignItems="center"
            h="100%"
            flexDir={{ base: 'column', md: 'row' }}
        >
            <Box>
                <Heading>404 :(</Heading>
                <Text fontWeight="normal">Looks like the page you are looking for does not exist.</Text>
                <Button>Back to Home</Button>
            </Box>
            <NotFoundSVG width="100%" />
        </Flex>
    );
};

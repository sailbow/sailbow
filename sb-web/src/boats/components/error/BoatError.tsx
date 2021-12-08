import React, { FunctionComponent } from 'react';

import { Flex, Box, Heading, Text, Link } from '@chakra-ui/react';
import { Routes } from 'router/Router.Types';
import { Footer } from 'modules/footer/Footer';

interface Props {
    title: string;
    message: string;
}

export const BoatError: FunctionComponent<Props> = ({ title, message }) => {
    return (
        <>
            <Flex justifyContent="center" alignItems="center" w="100%" py="48">
                <Box textAlign="center">
                    <Heading>{title}</Heading>
                    <Text>{message}</Text>
                    <Box pt="8">
                        <Text fontSize="xs">
                            Please contact us{' '}
                            <Link color="brand.teal" href={Routes.Whitelisted.Contact}>
                                here
                            </Link>{' '}
                            if the problem persists.
                        </Text>
                    </Box>
                </Box>
            </Flex>
            <Footer />
        </>
    );
};

import React, { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Flex, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'boats/Boat.Store';

export const Boat: FunctionComponent = () => {
    const [{ boat, loading }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            const response = await getBoat(boatId);

            if (!response) {
                console.log('enter error state');
            }
        })();
    }, []); // eslint-disable-line

    return loading.get ? (
        <Flex justifyContent="center" alignItems="center" w="100%" h="100%">
            <Spinner />
        </Flex>
    ) : (
        <Box className="container">
            <Heading>{boat?.name}</Heading>
            <Text>{boat?.description}</Text>
        </Box>
    );
};

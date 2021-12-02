import React, { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'boats/Boat.Store';

export const Boat: FunctionComponent = () => {
    const [{ boat, loading }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            await getBoat(boatId);
        })();
    }, []); // eslint-disable-line

    return loading.get ? (
        <Spinner />
    ) : (
        <Box className="container">
            <Heading>{boat?.name}</Heading>
            <Text>{boat?.description}</Text>
        </Box>
    );
};

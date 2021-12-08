import React, { FunctionComponent, useEffect } from 'react';

import { Box, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Banner, BoatError } from 'boats/components';
import { useBoat } from 'boats/Boat.Store';
import { HttpStatus } from 'util/http/Http';

export const Boat: FunctionComponent = () => {
    const [{ boat, loading, error }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            const response = await getBoat(boatId);

            if (!response) {
                console.log('enter error state');
            }
        })();
    }, []); // eslint-disable-line

    const BoatErrorRenderer: FunctionComponent = () => {
        switch (error.status) {
            case HttpStatus.NOT_FOUND:
                return <BoatError title="Boat not found" message="The boat you are looking for does not exist." />;
            case HttpStatus.UNAUTHORIZED:
                return <BoatError title="No access" message="Unfortunately you do not have access to this boat." />;
            default:
                return <BoatError title="Something went wrong" message="Apologies, ee could not locate your boat." />;
        }
    };

    const BoatRenderer: FunctionComponent = () => {
        return !error ? (
            <Box>
                <Banner banner={boat!.banner} />

                <Box className="container" pt="8">
                    <Heading>{boat?.name}</Heading>
                    <Text>{boat?.description}</Text>
                </Box>
            </Box>
        ) : (
            <BoatErrorRenderer />
        );
    };

    return loading.get ? (
        <Flex justifyContent="center" alignItems="center" w="100%" h="100%">
            <Spinner colorScheme="teal" />
        </Flex>
    ) : (
        <BoatRenderer />
    );
};

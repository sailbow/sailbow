import React, { FunctionComponent, useEffect } from 'react';

import { Box, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Banner } from 'boats/components';
import { useBoat } from 'boats/Boat.Store';
import { HttpStatus } from 'util/http/Http';
import { ErrorCode, getErrorPath } from 'util/error/Error';

export const Boat: FunctionComponent = () => {
    const [{ boat, loading, error }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            await getBoat(boatId);
        })();
    }, []); // eslint-disable-line

    useEffect(() => {
        if (error) {
            switch (error.status) {
                case HttpStatus.NOT_FOUND:
                    window.location.href = getErrorPath(ErrorCode.BoatNotFound);
                    break;
                case HttpStatus.FORBIDDEN:
                    window.location.href = getErrorPath(ErrorCode.BoatForbidden);
                    break;
                default:
                    window.location.href = getErrorPath(ErrorCode.BoatError);
            }
        }
    }, [error]);

    return loading.get && !boat ? (
        <Flex justifyContent="center" alignItems="center" w="100%" h="100%">
            <Spinner colorScheme="teal" />
        </Flex>
    ) : (
        <Box px="4">
            <Banner banner={boat!.banner} />

            <Box className="container" pt="8">
                <Heading>{boat?.name}</Heading>
                <Text>{boat?.description}</Text>
            </Box>
        </Box>
    );
};

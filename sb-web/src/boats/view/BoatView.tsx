import React, { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Banner } from 'boats/components';
import { useBoat } from 'boats/Boat.Store';
import { Loading } from 'components/loading/Loading';

export const BoatView: FunctionComponent = () => {
    const [{ boat, loading, error }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            console.log('here', loading);
            await getBoat(boatId);
        })();
    }, []); // eslint-disable-line

    return boat && !loading.get && !error ? (
        <>
            <Banner banner={boat.banner} />

            <Box className="container" pt="8">
                <Heading>{boat.name}</Heading>
                <Text>{boat.description}</Text>
            </Box>
        </>
    ) : (
        <Loading />
    );
};

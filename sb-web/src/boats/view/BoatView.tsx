import React, { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Banner } from 'boats/components';
import { useBoat } from 'boats/Boat.Store';
import { Loading } from 'components/loading/Loading';
import { Boat } from 'boats/Boat.Types';

export const BoatView: FunctionComponent = () => {
    const [{ boat, loading, error }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            console.log('here', loading);
            await getBoat(boatId);
        })();
    }, []); // eslint-disable-line

    const BoatRenderer: FunctionComponent<{ data: Boat }> = ({ data }) => {
        return (
            <>
                <Banner banner={data.banner} />

                <Box className="container" pt="8">
                    <Heading>{data.name}</Heading>
                    <Text>{data.description}</Text>
                </Box>
            </>
        );
    };

    return boat && !loading.get && !error ? <BoatRenderer data={boat} /> : <Loading />;
};

import React, { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Flex, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Banner } from 'boats/components';
import { useBoat } from 'boats/Boat.Store';
import { Toolbar } from 'boats/view/toolbar/Toolbar';
import { Layout } from 'components/layout/Layout';
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
            <Layout.Wrapper>
                <Layout.Header>
                    <Flex justifyContent="space-between" alignItems="center" py="4">
                        <Heading>{data.name}</Heading>
                        <Toolbar />
                    </Flex>
                </Layout.Header>
                <Layout.Body>
                    <Layout.Content flex="0.7">
                        <Box>This is the content</Box>
                    </Layout.Content>
                    <Layout.Sidebar flex="0.3">
                        <Box>
                            <Banner banner={data.banner} showControls={false} />
                            <Box pt="4">
                                <Heading fontSize="lg">{data.name}</Heading>
                                <Text fontWeight="normal">{data.description}</Text>
                            </Box>
                        </Box>
                    </Layout.Sidebar>
                </Layout.Body>
            </Layout.Wrapper>
        );
    };

    return boat && !loading.get && !error ? <BoatRenderer data={boat} /> : <Loading />;
};

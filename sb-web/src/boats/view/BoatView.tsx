import React, { FunctionComponent, useEffect } from 'react';

import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Banner } from 'boats/components';
import { useBoat } from 'boats/Boat.Store';
import { BoatTabs } from 'boats/view/tabs/Tabs';
import { Toolbar } from 'boats/view/toolbar/Toolbar';
import { Layout } from 'components/layout/Layout';
import { Loading } from 'components/loading/Loading';
import { Boat } from 'boats/Boat.Types';
import { SbRightArrowIcon } from 'util/icons/Icons';

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
                    <Toolbar boat={data} />
                </Layout.Header>
                <Layout.Body>
                    <Layout.Content flex="0.75">
                        <BoatTabs />
                    </Layout.Content>
                    <Layout.Sidebar flex="0.25">
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

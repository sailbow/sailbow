import { FunctionComponent, useEffect } from 'react';

import { Box, Skeleton, Stack, useBreakpointValue } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat } from 'modules/boats/Boat.Types';
import { BoatModulesWidget } from 'modules/boats/boat-modules/BoatModulesWidget';
import { BoatViewTabs } from 'modules/boats/boat-view/boat-view-tabs/BoatViewTabs';

export const BoatView: FunctionComponent = () => {
    const [{ activeBoat: boat, loading, error }, { getBoat, removeActiveBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();
    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        (async () => {
            if (boatId) {
                await getBoat(boatId);
            }
        })();

        return () => {
            removeActiveBoat();
        };
    }, []); // eslint-disable-line

    const BoatRenderer: FunctionComponent<{ data: Boat }> = ({ data }) => (
        <Box className="sb-boat-view-desktop" mt={{ base: 0, md: '68px' }}>
            <Box className="details-widget-box">
                <BoatModulesWidget boat={data} />
            </Box>
        </Box>
    );

    return isMobile ? (
        <BoatViewTabs boat={boat} loading={loading.get} />
    ) : boat && !loading.get ? (
        <BoatRenderer data={boat} />
    ) : (
        <Stack w="100%" spacing="8">
            <Skeleton h={200} />
            <Skeleton h={200} />
            <Skeleton h={200} />
        </Stack>
    );
};

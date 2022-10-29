import { FunctionComponent, useEffect } from 'react';

import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat } from 'modules/boats/Boat.Types';
import { BoatModuleManifest } from 'modules/boats/boat-modules/BoatModulesManifest';
import { BoatModulesWidget } from 'modules/boats/boat-modules/BoatModulesWidget';
import { BoatViewToolbar } from 'modules/boats/boat-view/boat-view-toolbar/BoatViewToolbar';
import { BoatViewTabs } from 'modules/boats/boat-view/boat-view-tabs/BoatViewTabs';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';

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
        <Box px={{ base: 0, md: 2 }} className="sb-boat-view-desktop">
            <BoatViewToolbar boat={data} />
            <Box className="details-widget-box">
                <Flex pt="4" display={{ base: 'none', md: 'flex' }}>
                    <Box width="480px" borderRight="1px solid #ececec">
                        <BoatModuleManifest boat={data} />
                    </Box>
                    <Box w="100%">
                        <BoatModulesWidget boat={data} />
                    </Box>
                </Flex>
            </Box>
        </Box>
    );

    return isMobile ? (
        <BoatViewTabs boat={boat} loading={loading.get} />
    ) : boat && !loading.get && !error ? (
        <BoatRenderer data={boat} />
    ) : (
        <PageSpinner loading={loading.get} />
    );
};

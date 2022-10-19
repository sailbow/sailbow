import { FunctionComponent, useEffect } from 'react';

import { Box, Flex, useBreakpointValue, Heading, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { BoatViewToolbar } from 'modules/boats/boat-view/boat-view-toolbar/BoatViewToolbar';
import { Boat } from 'modules/boats/Boat.Types';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { BoatViewTabs } from './boat-view-tabs/BoatViewTabs';
import { BoatModuleManifest } from '../boat-modules/BoatModulesManifest';
import { BoatWidget } from '../common/boat-widget/BoatWidget';
import { BoatModulesWidget } from '../boat-modules/BoatModulesWidget';

export const BoatView: FunctionComponent = () => {
    const [{ activeBoat: boat, loading, error }, { getBoat, removeActiveBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

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
        <Box px="2" className="sb-boat-view">
            <BoatViewToolbar boat={data} />
            <Box className="details-widget-box">
                <Flex gap="8" pt="4" display={{ base: 'none', md: 'flex' }}>
                    <Box width="400px" borderRight="1px solid #ececec" pr="4">
                        <Heading fontSize="lg" mb="4">
                            Manifest
                        </Heading>
                        <BoatModuleManifest boat={data} />
                    </Box>
                    <Box w="100%">
                        <Heading fontSize="lg" mb="4">
                            Widgets
                        </Heading>
                        <BoatModulesWidget boat={data} />
                    </Box>
                </Flex>

                <BoatViewTabs
                    manifest={<BoatModuleManifest boat={data} />}
                    widgets={<BoatModulesWidget boat={data} />}
                />
            </Box>
        </Box>
    );

    return boat && !loading.get && !error ? <BoatRenderer data={boat} /> : <PageSpinner loading={loading.get} />;
};

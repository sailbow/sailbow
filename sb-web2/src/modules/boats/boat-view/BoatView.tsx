import { FunctionComponent, useEffect } from 'react';

import { Box, Flex, useBreakpointValue, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { BoatViewToolbar } from 'modules/boats/boat-view/boat-view-toolbar/BoatViewToolbar';
import { Boat } from 'modules/boats/Boat.Types';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { BoatViewTabls } from './boat-view-tabs/BoatViewTabs';
import { BoatManifest } from './boat-manifest/BoatManifest';

export const BoatView: FunctionComponent = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
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

    const BoatRenderer: FunctionComponent<{ data: Boat }> = ({ data }) => {
        return (
            <Box px="2" className="sb-boat-view">
                <BoatViewToolbar boat={data} />
                <Box className="details-widget-box">
                    {!isMobile ? (
                        <Flex gap="8" pt="4">
                            <Box width="360px" borderRight="1px solid #ececec" pr="4">
                                <Heading fontSize="lg" mb="4">
                                    Details
                                </Heading>
                                <BoatManifest boat={data} />
                            </Box>
                            <Box>
                                <Heading fontSize="lg" mb="4">
                                    Widgets
                                </Heading>
                                Widgets go here
                            </Box>
                        </Flex>
                    ) : (
                        <BoatViewTabls manifest={<BoatManifest boat={data} />} widgets={<span>Widgets</span>} />
                    )}
                </Box>
            </Box>
        );
    };

    return boat && !loading.get && !error ? <BoatRenderer data={boat} /> : <PageSpinner loading={loading.get} />;
};

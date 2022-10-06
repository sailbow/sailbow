import { FunctionComponent, useEffect } from 'react';

import { Box, Flex, Button, useBreakpointValue, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { BoatTabs } from 'modules/boats/view/boat-tabs/BoatTabs';
import { Toolbar } from 'modules/boats/view/toolbar/Toolbar';
import { Boat } from 'modules/boats/Boat.Types';
import { SbPlusIcon } from 'shared/icons/Icons';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { MobileView } from './mobile-view/MobileView';
import { BoatDetails } from '../boat-details/BoatDetails';

export const BoatView: FunctionComponent = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [{ boat, loading, error }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            if (boatId) {
                await getBoat(boatId);
            }
        })();
    }, []); // eslint-disable-line

    const BoatRenderer: FunctionComponent<{ data: Boat }> = ({ data }) => {
        return (
            <Box px="2">
                <Toolbar boat={data} />
                {!isMobile ? (
                    <Flex gap="8">
                        <Box flex="0.25" display={{ base: 'none', md: 'block' }} flexShrink="0">
                            <Heading fontSize="lg" mb="4">
                                Details
                            </Heading>
                            {/* <Details boat={data} /> */}
                            <BoatDetails boat={data} />
                        </Box>
                        <Box flex={{ base: '1', md: '0.75' }} pr={{ base: 0, md: 8 }}>
                            <Heading fontSize="lg" mb="4">
                                Widgets
                            </Heading>
                            Widgets go here
                        </Box>
                    </Flex>
                ) : (
                    <></>
                    // <MobileView details={<Details boat={data} />} widgets={<span>Widgets</span>} />
                )}

                <Button
                    colorScheme="brand"
                    rightIcon={<SbPlusIcon />}
                    ml="4"
                    position="fixed"
                    bottom="16px"
                    right="16px"
                    size="lg"
                >
                    Add Widgets
                </Button>
            </Box>
        );
    };

    return boat && !loading.get && !error ? <BoatRenderer data={boat} /> : <PageSpinner loading={loading.get} />;
};

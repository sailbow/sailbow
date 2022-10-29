import { FC } from 'react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Boat } from 'modules/boats/Boat.Types';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { BoatModuleManifest } from 'modules/boats/boat-modules/BoatModulesManifest';
import { BoatModulesWidget } from 'modules/boats/boat-modules/BoatModulesWidget';

interface Props {
    loading: boolean;
    boat?: Boat;
}

export const BoatViewTabs: FC<Props> = ({ boat, loading }) => {
    return (
        <Tabs colorScheme="teal" h="100%" isFitted display={{ base: 'block', md: 'none' }}>
            <TabList>
                <Tab fontSize="sm" fontWeight="semibold">
                    Manifest
                </Tab>
                <Tab fontSize="sm" fontWeight="semibold">
                    Widgets
                </Tab>
            </TabList>

            <TabPanels h="100%">
                <TabPanel w="100%" h="100%" p="0" pt="4">
                    {boat && !loading ? <BoatModuleManifest boat={boat} /> : <PageSpinner loading={loading} />}
                </TabPanel>
                <TabPanel w="100%" h="100%" p="0" pt="4">
                    {boat && !loading ? <BoatModulesWidget boat={boat} /> : <PageSpinner loading={loading} />}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

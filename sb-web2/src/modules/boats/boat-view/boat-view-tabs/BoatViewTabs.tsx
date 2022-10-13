import { FC, ReactNode } from 'react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

interface Props {
    manifest: ReactNode;
    widgets: ReactNode;
}

export const BoatViewTabs: FC<Props> = ({ manifest, widgets }) => {
    return (
        <Tabs colorScheme="teal" h="100%" isFitted display={{ base: 'block', md: 'none' }}>
            <TabList>
                <Tab>Manifest</Tab>
                <Tab>Widgets</Tab>
            </TabList>

            <TabPanels h="100%">
                <TabPanel w="100%" h="100%" p="0" pt="4">
                    {manifest}
                </TabPanel>
                <TabPanel w="100%" h="100%" p="0" pt="4">
                    {widgets}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

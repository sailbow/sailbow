import { FC, ReactNode } from 'react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

interface Props {
    manifest: ReactNode;
    widgets: ReactNode;
}

export const BoatViewTabls: FC<Props> = ({ manifest, widgets }) => {
    return (
        <Tabs colorScheme="teal" h="100%" isFitted>
            <TabList>
                <Tab>Manifest</Tab>
                <Tab>Widgets</Tab>
            </TabList>

            <TabPanels h="100%">
                <TabPanel w="100%" h="100%" p="0" pt="4">
                    {manifest}
                </TabPanel>
                <TabPanel>{widgets}</TabPanel>
            </TabPanels>
        </Tabs>
    );
};

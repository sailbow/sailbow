import { FC, ReactNode } from 'react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

interface Props {
    details: ReactNode;
    widgets: ReactNode;
}

export const MobileView: FC<Props> = ({ details, widgets }) => {
    return (
        <Tabs colorScheme="teal" h="100%" isFitted>
            <TabList>
                <Tab>Details</Tab>
                <Tab>Widgets</Tab>
            </TabList>

            <TabPanels h="100%">
                <TabPanel w="100%" h="100%" p="0" pt="4">
                    {details}
                </TabPanel>
                <TabPanel>{widgets}</TabPanel>
            </TabPanels>
        </Tabs>
    );
};

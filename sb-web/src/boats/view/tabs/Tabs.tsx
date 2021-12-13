import React, { FunctionComponent } from 'react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

export const BoatTabs: FunctionComponent = () => {
    return (
        <Tabs colorScheme="teal">
            <TabList borderBottom="none">
                <Tab fontWeight="semibold">Day 1</Tab>
                <Tab>Add</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <p>React grid here for the widgets</p>
                </TabPanel>
                <TabPanel>
                    <p>two!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

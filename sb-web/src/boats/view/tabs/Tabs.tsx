import React, { FunctionComponent, useState } from 'react';

import { Box, Button, Tabs, TabList, TabPanels, Tab, TabPanel, IconButton } from '@chakra-ui/react';
import { SbPlusIcon } from 'util/icons/Icons';

interface Day {
    title: string;
    editing: boolean;
}

export const BoatTabs: FunctionComponent = () => {
    const [days, setDays] = useState<Day[]>([{ title: 'Day 1', editing: false }]);

    const onAdd = () => {
        setDays([...days, { title: `Day ${days.length + 1}`, editing: true }]);
    };

    return (
        <Box position="relative">
            <Tabs colorScheme="teal">
                <TabList borderBottom="none">
                    {days.map((day: Day) => (
                        <Tab fontWeight="semibold">{day.title}</Tab>
                    ))}
                    <IconButton
                        aria-label="add-tabs"
                        icon={<SbPlusIcon />}
                        variant="ghost"
                        colorScheme="gray"
                        onClick={onAdd}
                    />
                </TabList>
                <TabPanels>
                    <TabPanel height="1200px">
                        <p>React grid here for the widgets</p>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Button
                size="lg"
                colorScheme="orange"
                rightIcon={<SbPlusIcon />}
                ml="4"
                position="fixed"
                bottom="16px"
                right="16px"
            >
                Add Widgets
            </Button>
        </Box>
    );
};

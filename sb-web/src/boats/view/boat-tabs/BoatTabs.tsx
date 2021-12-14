import React, { FunctionComponent, useState } from 'react';

import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, IconButton, Text } from '@chakra-ui/react';
import { SbCloseIcon, SbPlusIcon } from 'util/icons/Icons';

import 'boats/view/boat-tabs/BoatTabs.scss';

interface Day {
    title: string;
    editing: boolean;
    panel: JSX.Element;
}

export const BoatTabs: FunctionComponent = () => {
    const [days, setDays] = useState<Day[]>([{ title: 'Day 1', editing: false, panel: <span>Panel!!</span> }]);
    const [tabIndex, setTabIndex] = React.useState<number>(0);

    const onAdd = () => {
        setDays([
            ...days,
            { title: `Day ${days.length + 1}`, editing: false, panel: <span>{`panel ${days.length + 1}`}</span> },
        ]);
        setTabIndex(days.length);
    };

    const onRemove = (idx: number) => {
        const currentDays = [...days];

        currentDays.splice(idx, 1);

        if (idx - 1 < 0) {
            setTabIndex(0);
        } else {
            setTabIndex(idx - 1);
        }

        setDays([...currentDays]);
    };

    const handleTabsChange = (index: number) => {
        setTabIndex(index);
    };

    return (
        <Box position="relative" className="sb-boat-tabs">
            <Tabs colorScheme="teal" index={tabIndex} isLazy onChange={handleTabsChange}>
                <TabList alignItems="center" className="tablist">
                    {days.map((day: Day, idx: number) => (
                        <Tab className="tab" fontWeight="semibold" pr="0" pl="3" as="div" key={day.title}>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text>{day.title}</Text>
                                <IconButton
                                    disabled={days.length === 1}
                                    size="xs"
                                    fontSize="lg"
                                    aria-label="add-tabs"
                                    icon={<SbCloseIcon />}
                                    variant="ghost"
                                    colorScheme="gray"
                                    color="gray.500"
                                    borderRadius="50%"
                                    ml="4"
                                    mr="1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();

                                        onRemove(idx);
                                    }}
                                />
                            </Flex>
                        </Tab>
                    ))}
                    <IconButton
                        borderRadius="50%"
                        aria-label="add-tabs"
                        icon={<SbPlusIcon />}
                        variant="ghost"
                        colorScheme="gray"
                        onClick={onAdd}
                        mx="2"
                        fontSize="xl"
                    />
                </TabList>
                <TabPanels>
                    {days.map((day: Day) => (
                        <TabPanel key={day.title} height="1230px">
                            {day.panel}
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
};

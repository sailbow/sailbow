import React, { FunctionComponent, useState } from 'react';

import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, IconButton, Text } from '@chakra-ui/react';

import { Widgets } from 'modules/boats/view/widgets/Widgets';
import { SbCheckIcon, SbCloseIcon, SbDeleteIcon, SbPlusIcon } from 'shared/icons/Icons';

import './BoatTabs.scss';

interface Day {
    title: string;
    editing: boolean;
    panel: JSX.Element;
}

export const BoatTabs: FunctionComponent = () => {
    const [days, setDays] = useState<Day[]>([{ title: 'Day 1', editing: false, panel: <span>Panel!!</span> }]);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [editMode, setEditMode] = useState<boolean>(false);

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
            <Tabs colorScheme="teal" index={tabIndex} isLazy onChange={handleTabsChange} orientation="vertical">
                <TabList alignItems="center" className="tablist" mt="2.5" display={{ base: 'none', md: 'flex' }}>
                    {days.map((day: Day, idx: number) => (
                        <Tab
                            className="tab"
                            fontWeight="semibold"
                            pr="0"
                            pl="3"
                            py="4"
                            as="div"
                            key={day.title}
                            justifyContent="start"
                            w="100%"
                        >
                            <Flex alignItems="center" w="100%" justifyContent="space-between">
                                <Text>{day.title}</Text>
                                {editMode && (
                                    <IconButton
                                        disabled={days.length === 1}
                                        size="xs"
                                        fontSize="lg"
                                        aria-label="add-tabs"
                                        icon={<SbCloseIcon />}
                                        variant="ghost"
                                        colorScheme="red"
                                        borderRadius="50%"
                                        ml="4"
                                        mr="1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();

                                            onRemove(idx);
                                        }}
                                    />
                                )}
                            </Flex>
                        </Tab>
                    ))}
                    <Flex mt="2">
                        <IconButton
                            borderRadius="50%"
                            aria-label="add-tabs"
                            icon={editMode ? <SbCheckIcon /> : <SbDeleteIcon />}
                            variant="ghost"
                            colorScheme="gray"
                            onClick={() => setEditMode(!editMode)}
                            mx="2"
                            fontSize="xl"
                        />
                        <IconButton
                            borderRadius="50%"
                            aria-label="add-tabs"
                            icon={<SbPlusIcon />}
                            variant="ghost"
                            colorScheme="gray"
                            onClick={onAdd}
                            mx="2"
                            fontSize="2xl"
                        />
                    </Flex>
                </TabList>
                <TabPanels>
                    {days.map((day: Day) => (
                        <TabPanel key={day.title} p="0">
                            <Widgets />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
};

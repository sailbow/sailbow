import { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import {
    Box,
    Flex,
    IconButton,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Divider,
    Button,
} from '@chakra-ui/react';

import {
    SbSettingsIcon,
    SbArrowLeftIcon,
    SbEditIcon,
    ModuleDateImage,
    SbCalendarIcon,
    ModuleLocationImage,
    SbLocationIcon,
    SbDeleteIcon,
    SbCheckIcon,
} from 'shared/icons/Icons';
import { BoatWidgetDetails } from './BoatWidgetDetails';
import { ModuleName, WidgetMode } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';

export interface WidgetProps {
    id: string;
    name: ModuleName;
    loading: boolean;
    data: any[];
    mode: WidgetMode;
}

interface WidgetMetaData {
    image: ReactNode;
    icon: ReactNode;
    name: string;
    info: string;
}

interface Props {
    settings: ReactNode;
    children: ReactNode;
    name: ModuleName;
    id: string;
    mode: WidgetMode;
    onSave: () => void;
    data: any[];
}

export const ModuleMapper: Record<ModuleName, WidgetMetaData> = {
    [ModuleName.Date]: {
        image: <ModuleDateImage />,
        icon: <SbCalendarIcon />,
        name: 'Date',
        info: 'Pin a date or a date range to your trip',
    },
    [ModuleName.Location]: {
        image: <ModuleLocationImage />,
        icon: <SbLocationIcon />,
        name: 'Location',
        info: 'List all the location options you want your group to see!',
    },
};

export const BoatWidget: FC<Props> = ({ id, children, settings, name, mode, data, onSave }) => {
    const module = useMemo(() => ModuleMapper[name], []);
    const [, { setWidgetMode, saveModuleData, removeModule }] = useBoat();

    const WidgetDescriptionPopover: FC = () => {
        return (
            <Popover isLazy trigger="hover" matchWidth>
                <PopoverTrigger>
                    <IconButton
                        fontSize="lg"
                        aria-label="settings"
                        colorScheme="gray"
                        variant="ghost"
                        size="sm"
                        icon={<>{module.icon}</>}
                    />
                </PopoverTrigger>
                <PopoverContent borderRadius="xl">
                    <PopoverBody w="100%">
                        <BoatWidgetDetails {...module} />
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <Box w="100%" borderRadius="xl" border="2px solid #ececec" px="4" py="2">
            <Flex alignItems="center" justifyContent="space-between" className="widget-header">
                <Flex alignItems="center">
                    <Box flexShrink="0" className="panel-icon">
                        {mode === WidgetMode.View || mode === WidgetMode.Edit ? (
                            <WidgetDescriptionPopover />
                        ) : (
                            <IconButton
                                fontSize="xl"
                                aria-label="settings"
                                colorScheme="gray"
                                variant="ghost"
                                size="sm"
                                icon={<SbArrowLeftIcon />}
                                onClick={() => setWidgetMode(id, WidgetMode.View)}
                            />
                        )}
                    </Box>
                    <Text fontWeight="bold" pl="1">
                        {mode === WidgetMode.View || mode === WidgetMode.Edit ? (
                            <>{module.name}</>
                        ) : (
                            `${module.name} Settings`
                        )}
                    </Text>
                </Flex>
                <Flex alignItems="center">
                    <IconButton
                        fontSize="xl"
                        aria-label="settings"
                        colorScheme="gray"
                        variant="ghost"
                        icon={<SbEditIcon />}
                        onClick={() => {
                            setWidgetMode(id, WidgetMode.Edit);
                        }}
                    />
                    <IconButton
                        fontSize="xl"
                        aria-label="settings"
                        colorScheme="gray"
                        variant="ghost"
                        icon={<SbSettingsIcon />}
                        onClick={() => setWidgetMode(id, WidgetMode.Settings)}
                    />
                    <IconButton
                        fontSize="xl"
                        aria-label="settings"
                        colorScheme="gray"
                        variant="ghost"
                        icon={<SbDeleteIcon />}
                        onClick={() => removeModule(id)}
                    />
                </Flex>
            </Flex>
            <Box py="2">
                {mode === WidgetMode.View || mode === WidgetMode.Edit ? (
                    <>
                        <>{children}</>

                        {mode === WidgetMode.Edit && data.length ? (
                            <>
                                <Divider my="4" />
                                <Flex justifyContent="flex-end">
                                    <Button
                                        onClick={() => {
                                            onSave();
                                            saveModuleData(id, data);
                                        }}
                                        rightIcon={<SbCheckIcon />}
                                    >
                                        Save
                                    </Button>
                                </Flex>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <>{settings}</>
                )}
            </Box>
        </Box>
    );
};

import { FC, ReactNode, useMemo, useState } from 'react';

import { Box, Flex, IconButton, Text, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';

import {
    SbSettingsIcon,
    SbArrowLeftIcon,
    SbEditIcon,
    ModuleDateImage,
    SbCalendarIcon,
    ModuleLocationImage,
    SbLocationIcon,
} from 'shared/icons/Icons';
import { BoatWidgetDetails } from './BoatWidgetDetails';
import { ModuleName } from 'modules/boats/Boat.Types';

export interface WidgetProps {
    name: ModuleName;
    loading: boolean;
    data: any[];
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
}

enum Mode {
    View,
    Settings,
}

const ModuleMapper: Record<ModuleName, WidgetMetaData> = {
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

export const BoatWidget: FC<Props> = ({ children, settings, name }) => {
    const [mode, setMode] = useState<Mode>(Mode.View);
    const module = useMemo(() => ModuleMapper[name], []);

    const toggleMode = () => {
        if (mode === Mode.View) setMode(Mode.Settings);
        else setMode(Mode.View);
    };

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
                        <BoatWidgetDetails image={module.image} label={module.name} info={module.info} />
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
                        {mode === Mode.View ? (
                            <WidgetDescriptionPopover />
                        ) : (
                            <IconButton
                                fontSize="xl"
                                aria-label="settings"
                                colorScheme="gray"
                                variant="ghost"
                                size="sm"
                                icon={<SbArrowLeftIcon />}
                                onClick={toggleMode}
                            />
                        )}
                    </Box>
                    <Text fontWeight="semibold" pl="1">
                        {mode === Mode.View ? <>{module.name}</> : 'Settings'}
                    </Text>
                </Flex>
                <Flex alignItems="center">
                    <IconButton
                        fontSize="2xl"
                        aria-label="settings"
                        colorScheme="gray"
                        variant="ghost"
                        icon={<SbEditIcon />}
                        onClick={() => setMode(Mode.View)}
                    />
                    <IconButton
                        fontSize="2xl"
                        aria-label="settings"
                        colorScheme="gray"
                        variant="ghost"
                        icon={<SbSettingsIcon />}
                        onClick={toggleMode}
                    />
                </Flex>
            </Flex>
            <Box py="2">{mode === Mode.View ? <>{children}</> : <>{settings}</>}</Box>
        </Box>
    );
};

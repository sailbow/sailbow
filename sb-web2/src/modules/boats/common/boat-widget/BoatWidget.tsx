import { FC, ReactNode, useState } from 'react';

import { Box, Flex, IconButton, Text, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';

import { SbSettingsIcon, SbArrowLeftIcon, SbEditIcon } from 'shared/icons/Icons';

interface Props {
    label: string;
    icon: ReactNode;
    settings: ReactNode;
    widgetInfo: string;
    widgetImage: ReactNode;
    children: ReactNode;
}

enum Mode {
    View,
    Settings,
}

export const BoatWidget: FC<Props> = ({ label, icon, children, settings, widgetInfo, widgetImage }) => {
    const [mode, setMode] = useState<Mode>(Mode.View);

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
                        icon={<>{icon}</>}
                    />
                </PopoverTrigger>
                <PopoverContent width="360px" borderRadius="xl">
                    <PopoverBody w="100%">
                        <Flex w="100%" gap="4" alignItems="flex-start">
                            <Box flex="0.2" width="80px" height="80px">
                                {widgetImage}
                            </Box>
                            <Box flex="0.8">
                                <Text fontWeight="semibold">{label}</Text>
                                <Text fontSize="sm">{widgetInfo}</Text>
                            </Box>
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <Box w="100%" borderRadius="xl" border="2px solid #ececec" px="4" py="2">
            <Flex alignItems="center" justifyContent="space-between" className="widget-header">
                <Flex alignItems="center">
                    <Box flexShrink="0" className="panel-icon" fontSize="lg">
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
                    <Text fontSize="lg" fontWeight="semibold" pl="1">
                        {mode === Mode.View ? <>{label}</> : 'Settings'}
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

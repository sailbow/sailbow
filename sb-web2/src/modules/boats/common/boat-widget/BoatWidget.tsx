import { FC, ReactNode, useMemo } from 'react';

import { Box, Flex, IconButton, Text, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';

import {
    SbSettingsIcon,
    SbArrowLeftIcon,
    SbEditIcon,
    ModuleDateImage,
    SbCalendarIcon,
    ModuleLocationImage,
    SbLocationIcon,
    SbDeleteIcon,
} from 'shared/icons/Icons';
import { BoatWidgetDetails } from './BoatWidgetDetails';
import { ModuleName, WidgetData, WidgetMode } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { Poll, Props as PollProps } from 'shared/poll/Poll';

export interface WidgetProps {
    id: string;
    name: ModuleName;
    loading: boolean;
    data: WidgetData[];
    mode: WidgetMode;
}

interface WidgetMetaData {
    image: ReactNode;
    icon: ReactNode;
    name: string;
    info: string;
}

interface Props extends WidgetProps, Omit<PollProps, 'selectOption'> {
    settings: ReactNode;
    children?: ReactNode;
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

export const BoatWidget: FC<Props> = ({
    id,
    children,
    settings,
    name,
    mode,
    data,
    loading,
    getInputComponent,
    onAddClick,
    onOptionEdit,
    onRemoveOption,
    onSave,
}) => {
    const module = useMemo(() => ModuleMapper[name], []);
    const [, { setWidgetMode, removeModule, selectOption, saveModuleData }] = useBoat();

    console.log(data);

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
                        as={Box}
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
                        {mode === WidgetMode.View && <>{module.name}</>}
                        {mode === WidgetMode.Edit && `Edit ${module.name}`}
                        {mode === WidgetMode.Settings && `${module.name} Settings`}
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
                        <Poll
                            loading={loading}
                            mode={mode}
                            data={data}
                            selectOption={selectOption}
                            getInputComponent={getInputComponent}
                            onAddClick={onAddClick}
                            onOptionEdit={onOptionEdit}
                            onRemoveOption={onRemoveOption}
                            onSave={() => {
                                onSave();
                                saveModuleData(id, data);
                            }}
                        />
                        {children}
                    </>
                ) : (
                    <>{settings}</>
                )}
            </Box>
        </Box>
    );
};

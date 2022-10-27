import { FC, PropsWithChildren, ReactNode, useMemo } from 'react';

import {
    Box,
    Flex,
    IconButton,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Button,
    Badge,
} from '@chakra-ui/react';

import { SbSettingsIcon, SbEditIcon, SbDeleteIcon, SbCheckCircleIcon, SbCheckMarkIcon } from 'shared/icons/Icons';
import { Module, ModuleMode, Role } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModulesMapper } from 'modules/boats/boat-modules/modules/Modules';
import { Poll, Props as PollProps } from 'shared/poll/Poll';

import { BoatWidgetDetails } from './BoatWidgetDetails';

interface Props<T> extends Module<T>, Omit<PollProps<T>, 'selectOption'> {
    settingsNode: ReactNode;
    children?: ReactNode;
}

export const BoatWidget = <T extends {}>({
    id,
    children,
    name,
    mode,
    data,
    loading,
    settingsNode,
    actionRequired,
    getInputComponent,
    onAddOption,
    onOptionEdit,
    onRemoveOption,
    onSave,
}: PropsWithChildren<Props<T>>) => {
    const module = useMemo(() => ModulesMapper[name], [name]);
    const [{ activeBoat }, { setModuleMode, removeModule, selectOption, saveModuleData }] = useBoat();

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
                        icon={<>{<module.icon />}</>}
                    />
                </PopoverTrigger>
                <PopoverContent borderRadius="xl">
                    <PopoverBody w="100%">
                        <BoatWidgetDetails name={module.name} image={<module.image />} info={module.info} />
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <Box w="100%" borderRadius="xl" border="2px solid #ececec" className="sb-boat-widget">
            <Flex
                bg={!actionRequired ? 'red.400' : 'white'}
                justifyContent="center"
                fontSize="sm"
                py={!actionRequired ? '1' : '0.5'}
                color="white"
                borderTopRightRadius="xl"
                borderTopLeftRadius="xl"
                fontWeight="semibold"
            >
                {!actionRequired && 'Your vote is required'}
            </Flex>
            <Box className="widget-wrapper">
                <Flex alignItems="center" justifyContent="space-between" className="widget-header" px="4" py="2">
                    <Flex alignItems="center">
                        <Box flexShrink="0" className="panel-icon">
                            <WidgetDescriptionPopover />
                        </Box>
                        <Text fontWeight="bold" pl="1">
                            {mode === ModuleMode.View && <>{module.name}</>}
                            {mode === ModuleMode.Edit && `Edit ${module.name}`}
                            {mode === ModuleMode.Settings && `${module.name} Settings`}
                        </Text>
                    </Flex>
                    <Flex alignItems="center" gap="1">
                        <IconButton
                            fontSize="2xl"
                            aria-label="edit"
                            colorScheme="gray"
                            variant={mode === ModuleMode.Edit ? 'solid' : 'ghost'}
                            icon={<SbEditIcon />}
                            onClick={() => {
                                setModuleMode(id, ModuleMode.Edit);
                            }}
                            display="flex"
                        />
                        <IconButton
                            fontSize="2xl"
                            aria-label="settings"
                            colorScheme="gray"
                            variant={mode === ModuleMode.Settings ? 'solid' : 'ghost'}
                            icon={<SbSettingsIcon />}
                            onClick={() => setModuleMode(id, ModuleMode.Settings)}
                        />
                        <IconButton
                            fontSize="2xl"
                            aria-label="delete"
                            colorScheme="gray"
                            variant="ghost"
                            icon={<SbDeleteIcon />}
                            onClick={() => removeModule(id)}
                            display="flex"
                        />
                    </Flex>
                </Flex>
                <Box pt="2" pb="6" className="widget-body" px="4">
                    {mode === ModuleMode.View || mode === ModuleMode.Edit ? (
                        <>
                            <Poll<T>
                                loading={loading}
                                mode={mode}
                                data={data}
                                selectOption={selectOption}
                                getInputComponent={getInputComponent}
                                onAddOption={onAddOption}
                                onOptionEdit={onOptionEdit}
                                onRemoveOption={onRemoveOption}
                                onSave={() => {
                                    if (onSave()) saveModuleData(id, data);

                                    return true;
                                }}
                            />
                            {children}
                        </>
                    ) : (
                        <>{settingsNode}</>
                    )}
                </Box>

                {mode === ModuleMode.View && activeBoat!.role === Role.Captain && (
                    <Flex className="widget-footer">
                        <Button
                            rightIcon={SbCheckMarkIcon}
                            w="100%"
                            variant="accent"
                            borderTopLeftRadius="0"
                            borderTopRightRadius="0"
                        >
                            Finalize
                        </Button>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

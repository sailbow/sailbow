import { FC, PropsWithChildren, ReactNode, useMemo } from 'react';

import { Box, Flex, IconButton, Text, PopoverTrigger, PopoverContent, PopoverBody, Button } from '@chakra-ui/react';

import { SbSettingsIcon, SbEditIcon, SbDeleteIcon, SbCheckMarkIcon, SbCloseIcon } from 'shared/icons/Icons';
import { Module, ModuleMode, ModuleType, Role } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModulesMapper } from 'modules/boats/boat-modules/modules/Modules';
import { Poll, Props as PollProps } from 'shared/poll/Poll';

import { BoatWidgetDetails } from './BoatWidgetDetails';
import { withRoleGuard } from 'shared/role/RoleGuard';
import { FinalizeModuleOptionRoleAccess } from 'shared/actions/Actions';
import { Popover } from 'shared/popover/Popover';

interface Props<T> extends Module<T>, Omit<PollProps<T>, 'selectOption' | 'onSave'> {
    settingsNode: ReactNode;
    children?: ReactNode;
}

const FinalizeButton = withRoleGuard(Button);

export const BoatWidget = <T extends {}>({ children, settingsNode, ...props }: PropsWithChildren<Props<T>>) => {
    const { id, name, mode, data, actionRequired } = props;
    const module = useMemo(() => ModulesMapper[name as ModuleType], [name]); // TODO: CHANGE NAME TO TYPE
    const [{ activeBoat }, { setModuleMode, removeModule, selectOption, saveModuleData }] = useBoat();

    const WidgetDescriptionPopover: FC = () => {
        return (
            <Popover
                trigger="hover"
                triggerNode={
                    <IconButton
                        fontSize="lg"
                        aria-label="settings"
                        colorScheme="gray"
                        variant="ghost"
                        size="sm"
                        as={Box}
                        icon={<>{<module.icon />}</>}
                    />
                }
            >
                <BoatWidgetDetails name={module.name} image={<module.image />} info={module.info} />
            </Popover>
        );
    };

    return (
        <Box w="100%" borderRadius="xl" border="2px solid #ececec" className="sb-boat-widget">
            <Flex
                bg={actionRequired && actionRequired === true ? 'red.400' : 'white'}
                justifyContent="center"
                fontSize="sm"
                py={actionRequired && actionRequired === true ? '1' : '0.5'}
                color="white"
                borderTopRightRadius="xl"
                borderTopLeftRadius="xl"
                fontWeight="semibold"
            >
                {actionRequired && actionRequired === true && 'Your vote is required'}
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
                            aria-label="cancel-settings"
                            colorScheme="gray"
                            variant="ghost"
                            icon={<SbCloseIcon />}
                            onClick={() => {
                                if (data.length) {
                                    setModuleMode(id, ModuleMode.View);
                                } else {
                                    setModuleMode(id, ModuleMode.Edit);
                                }
                            }}
                            display={mode === ModuleMode.Settings ? 'flex' : 'none'}
                        />
                        <IconButton
                            fontSize="2xl"
                            aria-label="edit"
                            colorScheme="gray"
                            variant={mode === ModuleMode.Edit ? 'solid' : 'ghost'}
                            icon={<SbEditIcon />}
                            onClick={() => {
                                setModuleMode(id, ModuleMode.Edit);
                            }}
                            display={mode === ModuleMode.Settings ? 'none' : 'flex'}
                        />
                        <IconButton
                            fontSize="2xl"
                            aria-label="settings"
                            colorScheme="gray"
                            variant={mode === ModuleMode.Settings ? 'solid' : 'ghost'}
                            icon={<SbSettingsIcon />}
                            onClick={() => setModuleMode(id, ModuleMode.Settings)}
                            display={mode === ModuleMode.Settings ? 'none' : 'flex'}
                        />
                        <IconButton
                            fontSize="2xl"
                            aria-label="delete"
                            colorScheme="gray"
                            variant="ghost"
                            icon={<SbDeleteIcon />}
                            onClick={() => removeModule(id)}
                            display={mode === ModuleMode.Settings ? 'none' : 'flex'}
                        />
                    </Flex>
                </Flex>
                <Box pt="2" pb="4" className="widget-body" px="4">
                    {mode === ModuleMode.View || mode === ModuleMode.Edit ? (
                        <>
                            <Poll<T>
                                {...props}
                                selectOption={selectOption}
                                onSave={() => {
                                    saveModuleData(id, data);
                                }}
                            />
                            {children}
                        </>
                    ) : (
                        <>{settingsNode}</>
                    )}
                </Box>

                {mode === ModuleMode.View && activeBoat!.role === Role.Captain && (
                    <Box className="widget-footer">
                        {/* <Flex justifyContent="flex-end" alignItems="center" px="4">
                            <Text pr="1" fontSize="xs">
                                Voted by
                            </Text>
                            <CrewGroup size="xs" crew={totalVotes} />
                        </Flex> */}
                        <Flex mt="2">
                            <FinalizeButton
                                role={activeBoat!.role}
                                acceptedRoles={FinalizeModuleOptionRoleAccess}
                                rightIcon={SbCheckMarkIcon}
                                w="100%"
                                variant="accent"
                                borderTopLeftRadius="0"
                                borderTopRightRadius="0"
                                borderRadius="xl"
                            >
                                Finalize
                            </FinalizeButton>
                        </Flex>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

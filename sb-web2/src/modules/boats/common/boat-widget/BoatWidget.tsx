import { FC, PropsWithChildren, ReactNode, useMemo } from 'react';

import { Box, Flex, IconButton, Text, Button, Badge } from '@chakra-ui/react';

import { Module, ModuleMode, ModuleType, Role } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModulesMapper } from 'modules/boats/boat-modules/modules/Modules';
import { Actions } from 'shared/actions/Actions';
import { SbSettingsIcon, SbEditIcon, SbDeleteIcon, SbCheckMarkIcon, SbCloseIcon } from 'shared/icons/Icons';
import { Poll, Props as PollProps } from 'shared/poll/Poll';
import { withRoleGuard } from 'shared/role/RoleGuard';
import { Popover } from 'shared/popover/Popover';

import { BoatWidgetDetails } from './BoatWidgetDetails';

interface Props<T> extends Module<T>, Omit<PollProps<T>, 'selectOption' | 'onSave'> {
    settingsNode: ReactNode;
    children?: ReactNode;
}

const FinalizeButton = withRoleGuard(Button);
const GuardedIconButton = withRoleGuard(IconButton);

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
        <Box
            w="100%"
            borderRadius="xl"
            borderStyle="solid"
            borderWidth="2px"
            borderColor={mode === ModuleMode.Edit ? 'brand.primary' : 'brand.border-light'}
            className="sb-boat-widget"
        >
            <Box className="widget-wrapper" pt="1">
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
                        {actionRequired && (
                            <Badge colorScheme="orange" variant="outline" mr="2">
                                Vote Required
                            </Badge>
                        )}
                        <GuardedIconButton
                            role={activeBoat!.role}
                            acceptedRoles={Actions.BoatSettingsRoleAccess}
                            aria-label="cancel-settings"
                            colorScheme="gray"
                            variant="ghost"
                            fontSize="2xl"
                            icon={<SbCloseIcon />}
                            onClick={() => {
                                if (data.length) setModuleMode(id, ModuleMode.View);
                                else setModuleMode(id, ModuleMode.Edit);
                            }}
                            display={mode === ModuleMode.Settings ? 'flex' : 'none'}
                        />
                        <GuardedIconButton
                            role={activeBoat!.role}
                            acceptedRoles={Actions.EditBoatDetailsRoleAccess}
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
                        <GuardedIconButton
                            role={activeBoat!.role}
                            acceptedRoles={Actions.BoatSettingsRoleAccess}
                            fontSize="2xl"
                            aria-label="settings"
                            colorScheme="gray"
                            variant={mode === ModuleMode.Settings ? 'solid' : 'ghost'}
                            icon={<SbSettingsIcon />}
                            onClick={() => setModuleMode(id, ModuleMode.Settings)}
                            display={mode === ModuleMode.Settings ? 'none' : 'flex'}
                        />
                        <GuardedIconButton
                            role={activeBoat!.role}
                            acceptedRoles={Actions.DeleteBoatRoleAccess}
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
                                acceptedRoles={Actions.FinalizeModuleOptionRoleAccess}
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

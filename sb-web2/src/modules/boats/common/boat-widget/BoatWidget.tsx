import { PropsWithChildren, ReactNode, useMemo } from 'react';

import { Box, Flex, IconButton, Text, Button, Badge, Icon } from '@chakra-ui/react';

import { Module, ModuleMode, ModuleType, Role } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModulesMapper } from 'modules/boats/boat-modules/modules/Modules';
import { Actions } from 'shared/actions/Actions';
import { SbSettingsIcon, SbEditIcon, SbDeleteIcon, SbCheckMarkIcon, SbCloseIcon } from 'shared/icons/Icons';
import { Poll, Props as PollProps } from 'shared/poll/Poll';
import { withActionsGuard } from 'shared/actions/Actions';
import { MoreMenu, MoreMenuOption } from 'shared/more-menu/MoreMenu';

interface Props<T> extends Module<T>, Omit<PollProps<T>, 'selectOption' | 'onSave' | 'role'> {
    settingsNode: ReactNode;
    children?: ReactNode;
}

const FinalizeButton = withActionsGuard(Button);
const GuardedIconButton = withActionsGuard(IconButton);

export const BoatWidget = <T extends {}>({ children, settingsNode, ...props }: PropsWithChildren<Props<T>>) => {
    const { id, name, mode, data, actionRequired } = props;
    const module = useMemo(() => ModulesMapper[name as ModuleType], [name]); // TODO: CHANGE NAME TO TYPE
    const [{ activeBoat }, { setModuleMode, removeModule, selectOption, saveModuleData }] = useBoat();

    const WidgetMenuOptions: MoreMenuOption[] = useMemo(
        () => [
            {
                id: `boat-widget-menu-edit-${id}`,
                label: 'Edit',
                icon: <SbEditIcon />,
                action: () => {
                    setModuleMode(id, ModuleMode.Edit);
                },
                role: activeBoat!.role,
                acceptedRoles: Actions.EditBoatDetails,
                props: {
                    variant: mode === ModuleMode.Edit ? 'solid' : 'ghost',
                    display: mode === ModuleMode.Settings ? 'none' : 'flex',
                },
            },
            {
                id: `boat-widget-menu-settings-${id}`,
                label: 'Settings',
                icon: <SbSettingsIcon />,
                action: () => {
                    setModuleMode(id, ModuleMode.Settings);
                },
                role: activeBoat!.role,
                acceptedRoles: Actions.BoatModuleSettings,
                props: {
                    variant: mode === ModuleMode.Settings ? 'solid' : 'ghost',
                    display: mode === ModuleMode.Settings ? 'none' : 'flex',
                },
            },
            {
                id: `boat-widget-menu-delete-${id}`,
                label: 'Delete',
                icon: <SbDeleteIcon />,
                action: () => {
                    removeModule(props.moduleId);
                },
                role: activeBoat!.role,
                acceptedRoles: Actions.BoatModuleSettings,
                props: {
                    variant: 'ghost',
                    display: mode === ModuleMode.Settings ? 'none' : 'flex',
                },
            },
        ],
        [activeBoat, id, setModuleMode, mode, removeModule],
    );

    return (
        <Box
            w="100%"
            borderRadius="xl"
            borderStyle="solid"
            borderWidth="2px"
            borderColor={
                mode === ModuleMode.Edit || mode === ModuleMode.Settings ? 'brand.primary' : 'brand.border-light'
            }
            className="sb-boat-widget"
        >
            <Box className="widget-wrapper" pt="1">
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    className="widget-header"
                    px={{ base: 3, md: 4 }}
                    py="2"
                >
                    <Flex alignItems="center">
                        <Box flexShrink="0" className="panel-icon">
                            <Icon fontSize="xl">
                                <module.icon />
                            </Icon>
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
                        <MoreMenu options={WidgetMenuOptions}>
                            {WidgetMenuOptions.map((option) => (
                                <GuardedIconButton
                                    key={option.id}
                                    role={option.role}
                                    acceptedRoles={option.acceptedRoles}
                                    fontSize="2xl"
                                    aria-label={option.label}
                                    icon={<>{option.icon}</>}
                                    onClick={option.action}
                                    colorScheme="gray"
                                    {...option.props}
                                />
                            ))}
                        </MoreMenu>

                        <GuardedIconButton
                            role={activeBoat!.role}
                            acceptedRoles={Actions.BoatSettings}
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
                    </Flex>
                </Flex>
                <Box pt="2" pb="4" className="widget-body" px={{ base: 2, md: 4 }}>
                    {mode === ModuleMode.View || mode === ModuleMode.Edit ? (
                        <>
                            <Poll<T>
                                {...props}
                                role={activeBoat!.role}
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
                                acceptedRoles={Actions.FinalizeModuleOption}
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

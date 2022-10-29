import { FC, useEffect } from 'react';

import { Box, Button, Center, Flex, Stack } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, ModuleExtended, ModuleType } from 'modules/boats/Boat.Types';
import { useSystem } from 'modules/system/System.Store';
import { SbBulbIcon, SbPlusIcon } from 'shared/icons/Icons';
import { ModuleDataType, ModulesMapper } from './modules/Modules';
import { HelperText } from 'shared/helper-text/HelperText';

interface Props {
    boat: Boat;
}

interface BoatModulesWidgetItemProps<T> {
    boatId: string;
    getModuleData: (boatId: string, moduleId: string) => Promise<void>;
    dataLoaded?: boolean;
    module: ModuleExtended<T>;
}

const getWidget = (module: ModuleExtended<any>) => {
    const Module = ModulesMapper[module.name as ModuleType]; // TODO: CHANGE NAME TO TYPE

    if (!Module) {
        throw Error(`Invalid moduleType: ${module.type}`);
    }

    return <Module.Widget {...module} />;
};

export const BoatModulesWidgetItem: FC<BoatModulesWidgetItemProps<ModuleDataType>> = ({
    boatId,
    module,
    getModuleData,
}) => {
    useEffect(() => {
        (async () => {
            if (!module.dataLoaded && !module.loading) {
                await getModuleData(boatId, module.id);
            }
        })();
    }, [boatId, getModuleData, module.dataLoaded, module.id, module.loading]);

    return <>{getWidget(module)}</>;
};

export const BoatModulesWidget: FC<Props> = ({ boat }) => {
    const [, { getModuleData }] = useBoat();
    const [, { openPicker }] = useSystem();

    return (
        <Box
            h={{ base: '100%', md: 'calc(100vh - 140px)' }}
            overflowY="auto"
            px={{ base: 0, md: 4 }}
            className="sb-boat-modules-widgets"
        >
            <Stack w="100%" spacing="4" h="100%">
                {boat.modules.map((module) => (
                    <BoatModulesWidgetItem
                        key={`widget-${module.id}-${module.order}`}
                        boatId={boat.id}
                        getModuleData={getModuleData}
                        module={module}
                    />
                ))}

                <Box
                    as={Object.values(boat.modules).length ? Flex : Center}
                    h="100%"
                    alignItems="center"
                    flexDir="column"
                    pb="16"
                >
                    {!boat.modules.length && (
                        <HelperText>Get started by adding widgets so your crew can vote on various options!</HelperText>
                    )}

                    <Button onClick={openPicker} variant="outline" rightIcon={<SbPlusIcon />}>
                        Add Widget
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

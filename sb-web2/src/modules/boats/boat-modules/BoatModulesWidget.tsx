import { FC, useEffect } from 'react';

import { Box, Button, Stack } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, Module, ModuleName } from 'modules/boats/Boat.Types';
import { useSystem } from 'modules/system/System.Store';
import { SbPlusIcon } from 'shared/icons/Icons';
import { ModuleDataType, ModulesMapper } from './modules/Modules';

interface Props {
    boat: Boat;
}

interface BoatModulesWidgetItemProps<T> {
    boatId: string;
    getModuleData: (boatId: string, moduleId: string) => Promise<void>;
    dataLoaded?: boolean;
    module: Module<T>;
}

const getWidget = (module: Module<any>) => {
    const Module = ModulesMapper[module.name as ModuleName];

    if (!Module) {
        throw Error(`Invalid moduleName: ${module.name}`);
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
            if (!module.dataLoaded) {
                await getModuleData(boatId, module.id);
            }
        })();
    }, [boatId, getModuleData, module.dataLoaded, module.id]);

    return <>{getWidget(module)}</>;
};

export const BoatModulesWidget: FC<Props> = ({ boat }) => {
    const [{}, { getModuleData }] = useBoat();
    const [, { openPicker }] = useSystem();

    return (
        <Box h={{ base: '100%', md: 'calc(100vh - 140px)' }} overflowY="auto">
            <Stack w="100%" spacing="4">
                {Object.values(boat.modules).map((module) => (
                    <BoatModulesWidgetItem
                        key={`widget-${module.id}-${module.order}`}
                        boatId={boat.id}
                        getModuleData={getModuleData}
                        module={module}
                    />
                ))}

                <Button onClick={openPicker} variant="outline" rightIcon={<SbPlusIcon />}>
                    Add Widget
                </Button>
            </Stack>
        </Box>
    );
};

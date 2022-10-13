import { FC, useEffect } from 'react';

import { Stack } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, ModuleExtended, ModuleId } from 'modules/boats/Boat.Types';
import { DateWidget } from './date/DateWidget';
import { LocationWidget } from './location/LocationWidget';

interface Props {
    boat: Boat;
}

interface BoatModulesWidgetItemProps {
    boatId: string;
    getModuleWidgetData: (boatId: string, moduleId: ModuleId) => Promise<void>;
    dataLoaded?: boolean;
    module: ModuleExtended;
}

export type WidgetDataType = any;

const getWidget = (moduleId: ModuleId, data: WidgetDataType | null, loading: boolean) => {
    switch (moduleId) {
        case ModuleId.Date:
            return <DateWidget />;
        case ModuleId.Location:
            return <LocationWidget />;
        default:
            throw Error(`Invalid moduleId: ${moduleId}`);
    }
};

export const BoatModulesWidgetItem: FC<BoatModulesWidgetItemProps> = ({
    boatId,
    dataLoaded,
    module,
    getModuleWidgetData,
}) => {
    useEffect(() => {
        (async () => {
            if (!dataLoaded) {
                await getModuleWidgetData(boatId, module.id);
            }
        })();
    }, []);

    return <>{getWidget(module.id, module.manifest, !dataLoaded)}</>;
};

export const BoatModulesWidget: FC<Props> = ({ boat }) => {
    const [, { getModuleWidgetData }] = useBoat();

    return (
        <Stack w="100%" spacing="4">
            {boat.modules.map((module) => (
                <BoatModulesWidgetItem
                    key={`widget-${module.id}-${module.order}`}
                    boatId={boat.id}
                    getModuleWidgetData={getModuleWidgetData}
                    dataLoaded={module.manifest.dataLoaded}
                    module={module}
                />
            ))}
        </Stack>
    );
};

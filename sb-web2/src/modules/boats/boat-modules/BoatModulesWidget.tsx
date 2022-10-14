import { FC, useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, ModuleExtended, ModuleName, Widget, WidgetData } from 'modules/boats/Boat.Types';
import { DateWidget, DateWidgetData } from './modules/date/DateWidget';
import { LocationWidget } from './modules/location/LocationWidget';
import { useSystem } from 'modules/system/System.Store';

interface Props {
    boat: Boat;
}

interface BoatModulesWidgetItemProps {
    boatId: string;
    getModuleWidgetData: (boatId: string, moduleId: string) => Promise<void>;
    dataLoaded?: boolean;
    module: ModuleExtended;
}

export interface WidgetDataType extends Widget {
    data: DateWidgetData[];
}

const getWidget = (moduleName: ModuleName, widgetData: WidgetDataType, loading: boolean) => {
    switch (moduleName) {
        case ModuleName.Date:
            return <DateWidget data={widgetData.data as DateWidgetData[]} loading={loading} />;
        case ModuleName.Location:
            return <LocationWidget />;
        default:
            throw Error(`Invalid moduleName: ${moduleName}`);
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

    return <>{getWidget(module.name, module.widget!, !dataLoaded)}</>;
};

export const BoatModulesWidget: FC<Props> = ({ boat }) => {
    const [, { getModuleWidgetData }] = useBoat();
    const [, { openPicker }] = useSystem();

    return (
        <Stack w="100%" spacing="4">
            {boat.modules.map((module) => (
                <BoatModulesWidgetItem
                    key={`widget-${module.id}-${module.order}`}
                    boatId={boat.id}
                    getModuleWidgetData={getModuleWidgetData}
                    dataLoaded={module.widget?.dataLoaded}
                    module={module}
                />
            ))}

            <Button onClick={openPicker}>Add Widget</Button>
        </Stack>
    );
};

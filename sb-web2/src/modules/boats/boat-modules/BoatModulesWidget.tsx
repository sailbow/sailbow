import { FC, useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, ModuleExtended, ModuleName, Widget, WidgetData, WidgetMode } from 'modules/boats/Boat.Types';
import { DateWidget, DateWidgetData } from './modules/date/DateWidget';
import { LocationWidget, LocationWidgetData } from './modules/location/LocationWidget';
import { useSystem } from 'modules/system/System.Store';
import { SbPlusIcon } from 'shared/icons/Icons';

interface Props {
    boat: Boat;
}

interface BoatModulesWidgetItemProps {
    boatId: string;
    getModuleWidgetData: (boatId: string, moduleId: string) => Promise<void>;
    dataLoaded?: boolean;
    module: ModuleExtended;
    mode: WidgetMode;
}

export interface WidgetDataType extends Widget {
    data: DateWidgetData[] | LocationWidgetData[];
}

const getWidget = (module: ModuleExtended, widgetData: WidgetDataType, mode: WidgetMode, loading: boolean) => {
    switch (module.name) {
        case ModuleName.Date:
            return <DateWidget data={widgetData.data as DateWidgetData[]} loading={loading} {...module} mode={mode} />;
        case ModuleName.Location:
            return (
                <LocationWidget
                    data={widgetData.data as LocationWidgetData[]}
                    loading={loading}
                    {...module}
                    mode={mode}
                />
            );
        default:
            throw Error(`Invalid moduleName: ${module.name}`);
    }
};

export const BoatModulesWidgetItem: FC<BoatModulesWidgetItemProps> = ({
    boatId,
    dataLoaded,
    module,
    mode,
    getModuleWidgetData,
}) => {
    useEffect(() => {
        (async () => {
            if (!dataLoaded) {
                await getModuleWidgetData(boatId, module.id);
            }
        })();
    }, []);

    return <>{getWidget(module, module.widget!, mode, !dataLoaded)}</>;
};

export const BoatModulesWidget: FC<Props> = ({ boat }) => {
    const [{ widgetActivity }, { getModuleWidgetData }] = useBoat();
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
                    mode={widgetActivity[module.id].mode}
                />
            ))}

            <Button onClick={openPicker} variant="outline" rightIcon={<SbPlusIcon />}>
                Add Widget
            </Button>
        </Stack>
    );
};

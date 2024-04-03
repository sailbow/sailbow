import { ModuleData, ModuleType } from 'modules/boats/Boat.Types';
import { DateModule, DateModuleDataType } from 'modules/boats/boat-modules/modules/date/Date';
import { LocationModule, LocationModuleDataType } from 'modules/boats/boat-modules/modules/location/Location';

export const ModulesMapper = {
    [ModuleType.Date]: {
        Widget: DateModule.Widget,
        Manifest: DateModule.Manifest,
        image: DateModule.Image,
        icon: DateModule.Icon,
        name: 'Date',
        type: ModuleType.Date,
        info: 'Pin a date or a date range to your trip',
    },
    [ModuleType.Location]: {
        Widget: LocationModule.Widget,
        Manifest: LocationModule.Manifest,
        image: LocationModule.Image,
        icon: LocationModule.Icon,
        name: 'Location',
        type: ModuleType.Location,
        info: "Vote on your group's destinations",
    },
};

export type ModuleDataType = DateModuleDataType | LocationModuleDataType;

export const renderData = (
    data: ModuleData<any>[],
    getText: (data: ModuleData<any>) => string,
    finalizedOptionId?: string,
) => {
    const foundData = data.find((d) => d.id === finalizedOptionId);

    if (!foundData) return '';

    return getText(foundData);
};

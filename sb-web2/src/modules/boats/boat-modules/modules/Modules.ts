import { ModuleData, ModuleName } from 'modules/boats/Boat.Types';
import { DateModule, DateModuleDataType } from 'modules/boats/boat-modules/modules/date/Date';

export const ModulesMapper = {
    [ModuleName.Date]: {
        Widget: DateModule.Widget,
        Manifest: DateModule.Manifest,
        image: DateModule.Image,
        icon: DateModule.Icon,
        name: 'Date',
        info: 'Pin a date or a date range to your trip',
    },
    [ModuleName.Location]: {
        Widget: DateModule.Widget,
        Manifest: DateModule.Manifest,
        image: DateModule.Image,
        icon: DateModule.Icon,
        name: 'Date',
        info: 'Pin a date or a date range to your trip',
    },
};

export type ModuleDataType = DateModuleDataType;

export const renderData = (
    data: ModuleData<DateModuleDataType>[],
    getText: (data: ModuleData<DateModuleDataType>) => string,
    finalizedOptionId?: string,
) => {
    const foundData = data.find((d) => d.id === finalizedOptionId);

    if (!foundData) return '';

    return getText(foundData);
};

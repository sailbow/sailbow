import { ModuleData, ModuleName } from 'modules/boats/Boat.Types';
import {
    DateWidget,
    DateManifest,
    DateModuleDataType,
    ModuleDateImage,
    DateModuleIcon,
} from 'modules/boats/boat-modules/modules/date/_DateModule';

export const ModulesMapper = {
    [ModuleName.Date]: {
        Widget: DateWidget,
        Manifest: DateManifest,
        image: ModuleDateImage,
        icon: DateModuleIcon,
        name: 'Date',
        info: 'Pin a date or a date range to your trip',
    },
    [ModuleName.Location]: {
        Widget: DateWidget,
        Manifest: DateManifest,
        image: ModuleDateImage,
        icon: DateModuleIcon,
        name: 'Location',
        info: 'Set a location for the trip',
    },
};

export type ModuleDataType = DateModuleDataType;

export const getFinalizedData = (data: ModuleData<ModuleDataType>[], finalizedOptionId?: string) => {
    const foundData = data.find((d) => d.id === finalizedOptionId);

    return foundData!;
};

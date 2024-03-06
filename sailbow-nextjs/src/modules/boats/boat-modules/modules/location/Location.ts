import { ModuleData } from '@/modules/boats/Boat.Types';
import { LocationSettings } from '@/modules/boats/boat-modules/modules/location/LocationSettings';
import { LocationManifest } from '@/modules/boats/boat-modules/modules/location/LocationManifest';
import { LocationWidget } from '@/modules/boats/boat-modules/modules/location/LocationWidget';
import { SbLocationIcon, ModuleLocationImage } from 'shared/icons/Icons';

export type LocationModuleDataType = {};

export const getText = (data: ModuleData<LocationModuleDataType>) => {
    // getText function here
    return '';
};

export const LocationModule = {
    Icon: SbLocationIcon,
    Image: ModuleLocationImage,
    Manifest: LocationManifest,
    Widget: LocationWidget,
    Settings: LocationSettings,
};

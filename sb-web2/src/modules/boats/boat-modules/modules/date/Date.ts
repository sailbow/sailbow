import { ModuleData } from 'modules/boats/Boat.Types';
import { DateSettings } from 'modules/boats/boat-modules/modules/date/DateSettings';
import { DateManifest } from 'modules/boats/boat-modules/modules/date/DateManifest';
import { DateWidget } from 'modules/boats/boat-modules/modules/date/DateWidget';
import { SbCalendarIcon, ModuleDateImage } from 'shared/icons/Icons';

export type DateModuleDataType = {
    startDate: string;
    endDate?: string;
};

export const formatDate = (inputDate: string) => {
    return new Date(inputDate).toLocaleDateString('en-us', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const getText = (data: ModuleData<DateModuleDataType>) => {
    const startDate = formatDate(data.startDate);
    const endDate = data.endDate ? formatDate(data.endDate) : null;

    return `${startDate}${endDate ? ` - ${endDate}` : ''}`;
};

export const DateModule = {
    Icon: SbCalendarIcon,
    Image: ModuleDateImage,
    Manifest: DateManifest,
    Widget: DateWidget,
    Settings: DateSettings,
};

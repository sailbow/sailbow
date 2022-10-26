import { ModuleData } from 'modules/boats/Boat.Types';
import { DateSettings } from 'modules/boats/boat-modules/modules/date/DateSettings';
import { DateManifest } from 'modules/boats/boat-modules/modules/date/DateManifest';
import { DateWidget } from 'modules/boats/boat-modules/modules/date/DateWidget';
import { SbCalendarIcon, ModuleDateImage } from 'shared/icons/Icons';

export type DateModuleDataType = {
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
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
    let startDate = formatDate(data.startDate);
    let endDate = data.endDate ? formatDate(data.endDate) : null;
    let time = '';

    if (data.startTime && data.endTime) {
        time = ` from ${data.startTime} - ${data.endTime}`;
    } else if (data.startTime && !data.endTime) {
        time = ` from ${data.startTime} `;
    } else if (!data.startTime && data.endTime) {
        time = ` ending at ${data.endTime}`;
    }

    return `${startDate}${endDate ? ` - ${endDate}` : ''} ${time}`;
};

export const DateModule = {
    Icon: SbCalendarIcon,
    Image: ModuleDateImage,
    Manifest: DateManifest,
    Widget: DateWidget,
    Settings: DateSettings,
};

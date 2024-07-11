import { ModuleData, ModuleType } from 'modules/boats/Boat.Types';
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

export const formatDate = (inputDate: Date) => {
    return inputDate.toLocaleString('en-us', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
};

export const getText = (data: DateModuleDataType) => {
    const startDate: Date = new Date(data.startDate);
    const endDate: Date | null = data.endDate ? new Date(data.endDate) : null;
    let text = '';

    if (startDate && endDate) {
        text = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
        text = `${formatDate(startDate)}`;
    }

    return text;
};

export const DateModule = {
    Icon: SbCalendarIcon,
    Image: ModuleDateImage,
    Manifest: DateManifest,
    Widget: DateWidget,
    Settings: DateSettings,
};

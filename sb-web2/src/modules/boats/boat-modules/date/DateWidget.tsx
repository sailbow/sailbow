import { FC } from 'react';

import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
import { ModuleDateImage, SbCalendarIcon } from 'shared/icons/Icons';
import { DateWidgetSettings } from './DateWidgetSettings';
import { WidgetData } from 'modules/boats/Boat.Types';

export interface DateWidgetData extends WidgetData {
    startDate: string;
    endData?: string;
}

interface Props {
    data: DateWidgetData[];
    loading: boolean;
}

export const DateWidget: FC<Props> = ({ data }) => {
    return (
        <BoatWidget
            label="Date"
            icon={<SbCalendarIcon />}
            settings={<DateWidgetSettings />}
            widgetImage={<ModuleDateImage />}
            widgetInfo="This is a date widget to set a date or a rade range"
        >
            <>Poll goes here</>
        </BoatWidget>
    );
};

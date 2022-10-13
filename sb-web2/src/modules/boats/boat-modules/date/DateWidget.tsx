import { FC } from 'react';

import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
import { ModuleDateImage, SbCalendarIcon } from 'shared/icons/Icons';
import { DateWidgetSettings } from './DateWidgetSettings';

export const DateWidget: FC = () => {
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

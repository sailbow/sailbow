import { FC } from 'react';

import { BoatWidget, WidgetProps } from 'modules/boats/common/boat-widget/BoatWidget';
import { DateWidgetSettings } from './DateWidgetSettings';
import { WidgetData } from 'modules/boats/Boat.Types';

export interface DateWidgetData extends WidgetData {
    startDate: string;
    endData?: string;
}

interface Props extends WidgetProps {
    data: DateWidgetData[];
}

export const DateWidget: FC<Props> = ({ name, loading, data }) => {
    return (
        <BoatWidget name={name} settings={<DateWidgetSettings />}>
            <>Poll goes here</>
        </BoatWidget>
    );
};

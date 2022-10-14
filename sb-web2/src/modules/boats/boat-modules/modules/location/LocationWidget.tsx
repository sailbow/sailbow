import { FC } from 'react';

import { BoatWidget, WidgetProps } from 'modules/boats/common/boat-widget/BoatWidget';
import { WidgetData } from 'modules/boats/Boat.Types';

export interface LocationWidgetData extends WidgetData {
    text: string;
    link: string;
}

interface Props extends WidgetProps {
    data: LocationWidgetData[];
}

export const LocationWidget: FC<Props> = ({ name, loading, data }) => {
    return (
        <BoatWidget name={name} settings={<>Location Widget Settings</>}>
            <>Poll goes here</>
        </BoatWidget>
    );
};

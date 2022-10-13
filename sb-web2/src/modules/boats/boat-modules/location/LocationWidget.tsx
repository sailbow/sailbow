import { FC } from 'react';

import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
import { ModuleLocationImage, SbLocationIcon } from 'shared/icons/Icons';

export const LocationWidget: FC = () => {
    return (
        <BoatWidget
            label="Location"
            icon={<SbLocationIcon />}
            settings={<>Location Widget Settings</>}
            widgetImage={<ModuleLocationImage />}
            widgetInfo="List all the location options you want your group to see!"
        >
            <>Poll goes here</>
        </BoatWidget>
    );
};

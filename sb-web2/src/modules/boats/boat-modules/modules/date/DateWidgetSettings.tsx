import { FC } from 'react';

import { BoatWidgetSettings } from 'modules/boats/common/boat-widget-settings/BoatWidgetSettings';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModuleSettings } from 'modules/boats/Boat.Types';

interface Props {
    id: string;
    settings: ModuleSettings;
}

export const DateWidgetSettings: FC<Props> = ({ id, settings }) => {
    return <BoatWidgetSettings id={id} settings={settings} />;
};

import { FC } from 'react';

import { BoatSettings } from '@/modules/boats/common/boat-settings/BoatSettings';
import { ModuleSettings } from '@/modules/boats/Boat.Types';

interface Props {
    id: string;
    settings: ModuleSettings;
}

export const LocationSettings: FC<Props> = ({ id, settings }) => {
    return <BoatSettings id={id} settings={settings} />;
};

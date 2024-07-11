import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { ModuleExtended } from 'modules/boats/Boat.Types';
import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { DateModule, DateModuleDataType, getText } from 'modules/boats/boat-modules/modules/date/Date';
import { renderData } from 'modules/boats/boat-modules/modules/Modules';

export const DateManifest: FC<ModuleExtended<DateModuleDataType>> = ({ moduleOptions: data, loading, finalizedOptionId }) => {
    return (
        <BoatManifest icon={<DateModule.Icon />} label="Date" loading={loading} finalized={finalizedOptionId}>
            <Text>{renderData(data, getText, finalizedOptionId)}</Text>
        </BoatManifest>
    );
};

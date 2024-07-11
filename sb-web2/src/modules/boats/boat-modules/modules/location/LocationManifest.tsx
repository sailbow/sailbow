import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { Module, ModuleExtended } from 'modules/boats/Boat.Types';
import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { LocationModule, LocationModuleDataType, getText } from 'modules/boats/boat-modules/modules/location/Location';
import { renderData } from 'modules/boats/boat-modules/modules/Modules';

export const LocationManifest: FC<ModuleExtended<LocationModuleDataType>> = ({ moduleOptions: data, loading, finalizedOptionId }) => {
    return (
        <BoatManifest icon={<LocationModule.Icon />} label="Location" loading={loading} finalized={finalizedOptionId}>
            <Text>{renderData(data, getText, finalizedOptionId)}</Text>
        </BoatManifest>
    );
};    
    
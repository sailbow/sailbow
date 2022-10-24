import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { DateModule, DateModuleDataType, getText } from './Date';
import { Module } from 'modules/boats/Boat.Types';
import { renderData } from '../Modules';

export const DateManifest: FC<Module<DateModuleDataType>> = ({ data, loading, finalizedOptionId }) => {
    return (
        <BoatManifest icon={<DateModule.Icon />} label="Date" loading={loading} finalized={finalizedOptionId}>
            <Text>{renderData(data, getText, finalizedOptionId)}</Text>
        </BoatManifest>
    );
};

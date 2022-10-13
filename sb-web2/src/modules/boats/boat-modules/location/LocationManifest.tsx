import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbLocationIcon } from 'shared/icons/Icons';

export interface LocationManifestProps {
    location: string;
    isLink: true;
}

export const LocationManifest: FC<LocationManifestProps> = ({ location, isLink }) => {
    return (
        <BoatManifest icon={<SbLocationIcon />} label="Location">
            <Text>{location ? location : 'In discussion'}</Text>
        </BoatManifest>
    );
};

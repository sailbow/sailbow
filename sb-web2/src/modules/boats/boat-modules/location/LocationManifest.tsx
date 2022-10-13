import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbLocationIcon } from 'shared/icons/Icons';

export interface LocationManifestProps {
    location: string;
    isLink: boolean;
    loading: boolean;
}

export const LocationManifest: FC<LocationManifestProps> = ({ location, isLink, loading }) => {
    return (
        <BoatManifest icon={<SbLocationIcon />} label="Location" loading={loading}>
            {location && <Text>{location}</Text>}
        </BoatManifest>
    );
};

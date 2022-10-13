import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbCalendarIcon } from 'shared/icons/Icons';

interface ManifestProps {
    data: any;
}

export const DateManifest: FC<ManifestProps> = ({ data }) => {
    return (
        <BoatManifest icon={<SbCalendarIcon />} label="Date">
            <Text>{data}</Text>
        </BoatManifest>
    );
};

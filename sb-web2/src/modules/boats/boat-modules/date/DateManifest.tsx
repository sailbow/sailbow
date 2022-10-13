import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbCalendarIcon } from 'shared/icons/Icons';

export interface DateManifestProps {
    data: string | null;
}

export const DateManifest: FC<DateManifestProps> = ({ data }) => {
    return (
        <BoatManifest icon={<SbCalendarIcon />} label="Date">
            <Text>{data}</Text>
        </BoatManifest>
    );
};

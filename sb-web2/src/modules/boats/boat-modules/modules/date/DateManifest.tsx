import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbCalendarIcon } from 'shared/icons/Icons';

export interface DateManifestProps {
    data: string | null;
    loading: boolean;
}

export const DateManifest: FC<DateManifestProps> = ({ data, loading }) => {
    return (
        <BoatManifest icon={<SbCalendarIcon />} label="Date" loading={loading}>
            {data && <Text>{data}</Text>}
        </BoatManifest>
    );
};

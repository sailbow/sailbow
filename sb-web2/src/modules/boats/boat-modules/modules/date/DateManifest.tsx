import { FC } from 'react';

import { Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbCalendarIcon } from 'shared/icons/Icons';
import { DateModuleDataType } from './_DateModule';
import { Module, ModuleData } from 'modules/boats/Boat.Types';
import { getFinalizedData } from '../Modules';

export const formatDate = (inputDate: string) => {
    return new Date(inputDate).toLocaleDateString('en-us', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const getText = (data: ModuleData<DateModuleDataType> | null) => {
    if (!data) return '';

    const startDate = formatDate(data.startDate);
    const endDate = data.endDate ? formatDate(data.endDate) : null;

    return `${startDate}${endDate ? ` - ${endDate}` : ''}`;
};

export const DateManifest: FC<Module<DateModuleDataType>> = ({ data, loading, finalizedOptionId }) => {
    return (
        <BoatManifest icon={<SbCalendarIcon />} label="Date" loading={loading} finalized={finalizedOptionId}>
            <Text>{getText(getFinalizedData(data, finalizedOptionId))}</Text>
        </BoatManifest>
    );
};

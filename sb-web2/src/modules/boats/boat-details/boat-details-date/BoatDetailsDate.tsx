import { FC } from 'react';

import { SbCalendarIcon } from 'shared/icons/Icons';

import { BoatDetailsItem } from '../boat-details-item/BoatDetailsItem';

export const BoatDetailsDate: FC = () => {
    return <BoatDetailsItem icon={<SbCalendarIcon />} label="Date" value="12 Feb '23 - 18 Feb '23" />;
};

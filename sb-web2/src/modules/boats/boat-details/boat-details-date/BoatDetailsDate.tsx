import { FC } from 'react';

import { SbCalendarIcon } from 'shared/icons/Icons';

import { BoatDetailsItem, ItemProps } from '../boat-details-item/BoatDetailsItem';

export const BoatDetailsDate: FC<ItemProps> = ({ confirmed }) => {
    return (
        <BoatDetailsItem icon={<SbCalendarIcon />} label="Date" value="12 Feb '23 - 18 Feb '23" confirmed={confirmed} />
    );
};

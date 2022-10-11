import { FC } from 'react';

import { SbLocationIcon } from 'shared/icons/Icons';

import { BoatDetailsItem, ItemProps } from '../boat-details-item/BoatDetailsItem';

export const BoatDetailsLocation: FC<ItemProps> = ({ confirmed }) => {
    return <BoatDetailsItem icon={<SbLocationIcon />} label="Location" confirmed={confirmed} value="Chicago" />;
};

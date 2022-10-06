import { FC } from 'react';

import { UserList } from 'modules/boats/components';
import { SbUserGroup } from 'shared/icons/Icons';

import { BoatDetailsItem } from '../boat-details-item/BoatDetailsItem';
import { Crew } from 'modules/boats/Boat.Types';

interface Props {
    crew: Crew[];
}

export const BoatDetailsCrew: FC<Props> = ({ crew }) => {
    // you have to populate the users here

    return <BoatDetailsItem icon={<SbUserGroup />} label="Crew" value="21" isButton panel={<UserList crew={crew} />} />;
};

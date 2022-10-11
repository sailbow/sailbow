import { FC } from 'react';

import { Accordion } from '@chakra-ui/react';

import { BoatDetailsDate } from './boat-details-date/BoatDetailsDate';
import { BoatDetailsCrew } from './boat-details-crew/BoatDetailsCrew';
import { BoatDetailsInfo } from './boat-details-info/BoatDetailsInfo';
import { BoatDetailsLocation } from './boat-details-location/BoatDetailsLocation';

import { Boat } from '../Boat.Types';

interface Props {
    boat: Boat;
}

export const BoatDetails: FC<Props> = ({ boat }) => {
    return (
        <Accordion allowMultiple defaultIndex={[]}>
            <BoatDetailsDate />
            <BoatDetailsLocation confirmed={true} />
            <BoatDetailsCrew crew={boat.crew} />
            <BoatDetailsInfo boat={boat} />
        </Accordion>
    );
};

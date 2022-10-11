import { FC } from 'react';

import { Accordion } from '@chakra-ui/react';

import { BoatDetailsDate } from './boat-details-date/BoatDetailsDate';
import { BoatDetailsCrew } from './boat-details-crew/BoatDetailsCrew';
import { Boat } from '../Boat.Types';
import { BoatDetailsInfo } from './boat-details-info/BoatDetailsInfo';

interface Props {
    boat: Boat;
}

export const BoatDetails: FC<Props> = ({ boat }) => {
    return (
        <Accordion allowMultiple defaultIndex={[]}>
            <BoatDetailsDate />
            <BoatDetailsCrew crew={boat.crew} />
            <BoatDetailsInfo boat={boat} />
        </Accordion>
    );
};

import { FC } from 'react';

import { Accordion } from '@chakra-ui/react';

import { BoatDetailsDate } from './boat-manifest-date/BoatDetailsDate';
import { BoatDetailsCrew } from '../../boat-widgets/boat-manifest-crew/BoatDetailsCrew';
import { BoatDetailsInfo } from './boat-manifest-info/BoatDetailsInfo';
import { BoatDetailsLocation } from './boat-manifest-location/BoatDetailsLocation';

import { Boat } from '../../Boat.Types';

interface Props {
    boat: Boat;
}

export const BoatManifest: FC<Props> = ({ boat }) => {
    return (
        <Accordion allowMultiple defaultIndex={[]}>
            <BoatDetailsInfo boat={boat} />
            <BoatDetailsDate confirmed />
            <BoatDetailsLocation confirmed />
            <BoatDetailsCrew crew={boat.crew} />
        </Accordion>
    );
};

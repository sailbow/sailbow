import { FC } from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { Crew } from 'modules/boats/Boat.Types';
import { BoatDetailsItem } from 'modules/boats/view/boat-details/boat-details-item/BoatDetailsItem';
import { CrewGroup } from 'shared/crew/crew-group/CrewGroup';

import { SbPlusIcon, SbUserGroup } from 'shared/icons/Icons';

interface Props {
    crew: Crew[];
}

export const BoatDetailsCrew: FC<Props> = ({ crew }) => {
    // you have to populate the users here

    return (
        <BoatDetailsItem icon={<SbUserGroup />} label="Crew (5)" confirmed>
            <Flex justifyContent="space-between" alignItems="center">
                <CrewGroup crew={crew} />

                <Button size="sm" rightIcon={<SbPlusIcon />}>
                    Invite
                </Button>
            </Flex>
        </BoatDetailsItem>
    );
};

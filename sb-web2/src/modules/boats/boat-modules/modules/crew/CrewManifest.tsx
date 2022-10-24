import { FC } from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbInfoIcon, SbPlusIcon } from 'shared/icons/Icons';
import { Boat } from 'modules/boats/Boat.Types';
import { CrewGroup } from 'shared/crew/crew-group/CrewGroup';
import { useSystem } from 'modules/system/System.Store';

interface Props {
    boat: Boat;
}

export const CrewManifest: FC<Props> = ({ boat }) => {
    const [, { openCrewNav }] = useSystem();

    return (
        <BoatManifest icon={<SbInfoIcon />} label={`Crew (${boat.crew.length})`} finalized="Crew">
            <Flex w="100%" justifyContent="space-between" alignItems="center">
                <CrewGroup crew={boat.crew} onClick={openCrewNav} />
                <Button size="sm" rightIcon={<SbPlusIcon />} variant="secondary" colorScheme="gray">
                    Invite
                </Button>
            </Flex>
        </BoatManifest>
    );
};

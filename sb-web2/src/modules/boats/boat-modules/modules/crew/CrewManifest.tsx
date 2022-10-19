import { FC } from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbInfoIcon, SbPlusIcon } from 'shared/icons/Icons';
import { Boat } from 'modules/boats/Boat.Types';
import { CrewGroup } from 'shared/crew/crew-group/CrewGroup';

interface Props {
    data: Pick<Boat, 'crew'>;
}

export const CrewManifest: FC<Props> = ({ data }) => {
    return (
        <BoatManifest icon={<SbInfoIcon />} label={`Crew (${data.crew.length})`}>
            <Flex w="100%" justifyContent="space-between" alignItems="center">
                <CrewGroup crew={data.crew} />
                <Button size="sm" rightIcon={<SbPlusIcon />} variant="secondary" colorScheme="gray">
                    Invite
                </Button>
            </Flex>
        </BoatManifest>
    );
};

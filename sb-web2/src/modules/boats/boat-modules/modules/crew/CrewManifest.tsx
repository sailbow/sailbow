import { FC, useEffect, useState } from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbInfoIcon, SbPlusIcon } from 'shared/icons/Icons';
import { Boat, Crew } from 'modules/boats/Boat.Types';
import { CrewGroup } from 'shared/crew/crew-group/CrewGroup';
import { getCrew } from 'modules/boats/Boat.Service';

interface Props {
    boatId: string;
}

export const CrewManifest: FC<Props> = ({ boatId }) => {
    const [data, setData] = useState<Crew[]>([]);

    useEffect(() => {
        (async () => {
            const response = await getCrew(boatId);
            setData(response);
        })();
    }, [boatId]);

    return (
        <BoatManifest icon={<SbInfoIcon />} label={`Crew (${data.length})`} finalized="Crew">
            <Flex w="100%" justifyContent="space-between" alignItems="center">
                <CrewGroup crew={data} />
                <Button size="sm" rightIcon={<SbPlusIcon />} variant="secondary" colorScheme="gray">
                    Invite
                </Button>
            </Flex>
        </BoatManifest>
    );
};

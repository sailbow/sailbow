import { FC } from 'react';

import { Box, Link, Text } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbInfoIcon } from 'shared/icons/Icons';
import { BoatBanner } from 'modules/boats/common';
import { Boat } from 'modules/boats/Boat.Types';
import { useSystem } from 'modules/system/System.Store';

interface Props {
    data: Pick<Boat, 'name' | 'banner' | 'description' | 'crew'>;
}

export const InfoManifest: FC<Props> = ({ data }) => {
    const [{}, { openEditNav }] = useSystem();

    return (
        <BoatManifest
            icon={<SbInfoIcon />}
            label="Information"
            action={
                <Link fontSize="sm" onClick={openEditNav}>
                    Edit
                </Link>
            }
            finalized="Info"
            className="sb-info-manifest"
        >
            <Box w="100%" py="1">
                <Box h="200px">
                    <BoatBanner id="details" banner={data.banner} showControls={false} />
                </Box>
                <Box pt="2">
                    <Text fontWeight="semibold">{data.name}</Text>
                    <Text fontSize="sm">{data.description}</Text>
                </Box>
            </Box>
        </BoatManifest>
    );
};

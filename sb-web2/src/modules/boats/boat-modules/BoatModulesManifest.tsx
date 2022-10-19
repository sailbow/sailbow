import { FC } from 'react';

import { Box } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { InfoManifest } from 'modules/boats/boat-modules/modules/info/InfoManifest';
import { CrewManifest } from 'modules/boats/boat-modules/modules/crew/CrewManifest';
import { ModulesMapper } from 'modules/boats/boat-modules/modules/Modules';

interface Props {
    boat: Boat;
}

export const BoatModuleManifest: FC<Props> = ({ boat }) => {
    return (
        <Box mt="-2">
            <InfoManifest data={boat} />
            <CrewManifest data={boat} />
            {Object.values(boat.modules).map((module) => {
                const Module = ModulesMapper[module.name];

                return <Module.Manifest key={module.id} {...module} />;
            })}
        </Box>
    );
};

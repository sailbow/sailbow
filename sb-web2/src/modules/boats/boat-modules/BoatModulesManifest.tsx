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
        <Box
            mt="-2"
            h={{ base: '100%', md: 'calc(100vh - 140px)' }}
            overflowY="auto"
            pr="4"
            className="sb-boat-module-manifest"
        >
            <InfoManifest data={boat} />
            <CrewManifest boat={boat} />
            {Object.values(boat.modules).map((module) => {
                const Module = ModulesMapper[module.moduleType];

                return <Module.Manifest key={module.id} {...module} />;
            })}
        </Box>
    );
};

import { FC } from 'react';

import { Box } from '@chakra-ui/react';

import { Boat, ModuleType } from 'modules/boats/Boat.Types';
import { InfoManifest } from 'modules/boats/boat-modules/modules/info/InfoManifest';
import { CrewManifest } from 'modules/boats/boat-modules/modules/crew/CrewManifest';
import { ModulesMapper } from 'modules/boats/boat-modules/modules/Modules';

interface Props {
    boat: Boat;
}

export const BoatModuleManifest: FC<Props> = ({ boat }) => {
    return (
        <Box pr={{ base: 0, md: 4 }} className="sb-boat-module-manifest" pb="16">
            <InfoManifest data={boat} />
            <CrewManifest boat={boat} />
            {boat.modules.map((module) => {
                const Module = ModulesMapper[module.name as ModuleType]; // TODO: CHANGE NAME TO TYPE

                return <Module.Manifest key={module.id} {...module} />;
            })}
        </Box>
    );
};

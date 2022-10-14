import { FC, useEffect } from 'react';

import { Box } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, Manifest, ModuleExtended, ModuleName } from 'modules/boats/Boat.Types';
import { DateManifest, DateManifestProps } from 'modules/boats/boat-modules/date/DateManifest';
import { InfoManifest } from 'modules/boats/boat-modules/info/InfoManifest';
import { LocationManifest, LocationManifestProps } from 'modules/boats/boat-modules/location/LocationManifest';
import { CrewManifest } from 'modules/boats/boat-modules/crew/CrewManifest';

interface Props {
    boat: Boat;
}

interface BoatModuleManifestItemProps {
    boatId: string;
    getModuleManifestData: (boatId: string, moduleId: string) => Promise<void>;
    dataLoaded?: boolean;
    module: ModuleExtended;
}

export interface ManifestDataType extends LocationManifestProps, DateManifestProps {}
export interface ManifestDataTypeExtended extends Manifest {}

const getManifest = (moduleName: ModuleName, data: ManifestDataTypeExtended | null, loading: boolean) => {
    switch (moduleName) {
        case ModuleName.Date:
            return <DateManifest {...({ ...data, loading } as DateManifestProps)} />;
        case ModuleName.Location:
            return <LocationManifest {...({ ...data, loading } as LocationManifestProps)} />;
        default:
            throw Error(`Invalid moduleName: ${moduleName}`);
    }
};

export const BoatModuleManifestItem: FC<BoatModuleManifestItemProps> = ({
    boatId,
    dataLoaded,
    module,
    getModuleManifestData,
}) => {
    useEffect(() => {
        (async () => {
            if (!dataLoaded) {
                await getModuleManifestData(boatId, module.id);
            }
        })();
    }, []);

    return <>{getManifest(module.name, module.manifest!, !dataLoaded)}</>;
};

export const BoatModuleManifest: FC<Props> = ({ boat }) => {
    const [, { getModuleManifestData }] = useBoat();

    return (
        <Box mt="-2">
            <InfoManifest data={boat} />
            <CrewManifest data={boat} />
            {boat.modules.map((module) => (
                <BoatModuleManifestItem
                    key={`manifest-${module.id}-${module.order}`}
                    boatId={boat.id}
                    getModuleManifestData={getModuleManifestData}
                    dataLoaded={module.manifest?.dataLoaded}
                    module={module}
                />
            ))}
        </Box>
    );
};

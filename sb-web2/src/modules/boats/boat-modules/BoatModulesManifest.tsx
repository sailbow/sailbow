import { FC, useEffect } from 'react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, ModuleExtended, ModuleId } from 'modules/boats/Boat.Types';
import { DateManifest, DateManifestProps } from 'modules/boats/boat-modules/date/DateManifest';
import { InfoManifest } from './info/InfoManifest';
import { LocationManifest, LocationManifestProps } from './location/LocationManifest';

interface Props {
    boat: Boat;
}

interface BoatModuleManifestItemProps {
    boatId: string;
    getModuleManifestData: (boatId: string, moduleId: ModuleId) => Promise<any | null>;
    dataLoaded?: boolean;
    module: ModuleExtended;
}

export type ManifestDataType = any;

const getManifest = (moduleId: ModuleId, data: ManifestDataType | null, loading: boolean) => {
    switch (moduleId) {
        case ModuleId.Date:
            return <DateManifest {...({ ...data, loading } as DateManifestProps)} />;
        case ModuleId.Location:
            return <LocationManifest {...({ ...data, loading } as LocationManifestProps)} />;
        default:
            throw Error(`Invalid moduleId: ${moduleId}`);
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

    return <>{getManifest(module.id, module.manifest, !dataLoaded)}</>;
};

export const BoatModuleManifest: FC<Props> = ({ boat }) => {
    const [, { getModuleManifestData }] = useBoat();

    return (
        <>
            <InfoManifest data={boat} />
            {boat.modules.map((module) => (
                <BoatModuleManifestItem
                    key={`${module.id}-${module.order}`}
                    boatId={boat.id}
                    getModuleManifestData={getModuleManifestData}
                    dataLoaded={module.manifest.dataLoaded}
                    module={module}
                />
            ))}
        </>
    );
};

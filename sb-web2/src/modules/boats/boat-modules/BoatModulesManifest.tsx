import { FC, useEffect, useState } from 'react';

import { Accordion } from '@chakra-ui/react';

import { useBoat } from 'modules/boats/Boat.Store';
import { Boat, ModuleId } from 'modules/boats/Boat.Types';
import { DateManifest } from 'modules/boats/boat-modules/date/DateManifest';
import { InfoManifest } from './info/InfoManifest';

interface Props {
    boat: Boat;
}

interface BoatModuleManifestItem {
    moduleId: ModuleId;
    boatId: string;
    getModuleManifestData: (boatId: string, moduleId: ModuleId) => Promise<any | null>;
}

const getManifest = (moduleId: ModuleId, data: any) => {
    switch (moduleId) {
        case ModuleId.Date:
            return <DateManifest data={data} />;
        default:
            throw Error(`Invalid moduleId: ${moduleId}`);
    }
};

export const BoatModuleManifestItem: FC<BoatModuleManifestItem> = ({ boatId, moduleId, getModuleManifestData }) => {
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        (async () => {
            const response = await getModuleManifestData(boatId, moduleId);
            setData(response);
        })();
    }, []);

    return <>{getManifest(moduleId, data)}</>;
};

export const BoatModuleManifest: FC<Props> = ({ boat }) => {
    const [, { getModuleManifestData }] = useBoat();

    return (
        <>
            <Accordion allowMultiple defaultIndex={[]}>
                <InfoManifest data={boat} />
                {boat.modules.map((module) => (
                    <BoatModuleManifestItem
                        key={module.id}
                        boatId={boat.id}
                        moduleId={module.id}
                        getModuleManifestData={getModuleManifestData}
                    />
                ))}
            </Accordion>
        </>
    );
};

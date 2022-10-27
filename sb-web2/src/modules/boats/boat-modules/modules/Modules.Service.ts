import { AxiosResponse } from 'axios';

import { Module } from 'modules/boats/Boat.Types';
import { Http } from 'util/http/Http';
import { EndpointFunction } from 'util/http/Endpoints';
import { ModuleDataType } from './Modules';

type ModuleEndpointLabels = 'Add' | 'Upsert';
export const ModuleEndpoints: Record<ModuleEndpointLabels, EndpointFunction> = {
    Add: ({ boatId, module }) => ({
        method: 'POST',
        url: `api/boats/${boatId}/modules`,
        data: {
            ...module,
        },
    }),
    Upsert: ({ boatId, module }) => ({
        method: 'PUT',
        url: `api/boats/${boatId}/modules`,
        data: {
            ...module,
        },
    }),
};

export const addModule = async (boatId: string, module: Module<ModuleDataType>): Promise<Module<ModuleDataType>> => {
    const { data }: AxiosResponse<Module<ModuleDataType>> = await Http(ModuleEndpoints.Add({ boatId, module }));

    return data;
};

export const upsertModule = async (
    boatId: string,
    module: Pick<Module<any>, 'name' | 'description' | 'settings' | 'order' | 'data'>,
): Promise<Module<any>> => {
    const { data }: AxiosResponse<Module<any>> = await Http(ModuleEndpoints.Upsert({ boatId, module }));

    return data;
};

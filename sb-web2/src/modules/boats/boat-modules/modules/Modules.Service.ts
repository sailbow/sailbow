import { AxiosResponse } from 'axios';

import { Module } from 'modules/boats/Boat.Types';
import { Http } from 'util/http/Http';
import { EndpointFunction } from 'util/http/Endpoints';
import { ModuleDataType } from './Modules';

type ModuleEndpointLabels = 'Add' | 'UpdateAll';
export const ModuleEndpoints: Record<ModuleEndpointLabels, EndpointFunction> = {
    Add: ({ boatId, module }) => ({
        method: 'POST',
        url: `api/boats/${boatId}/modules`,
        data: {
            ...module,
        },
    }),
    UpdateAll: ({ boatId, modules }) => ({
        method: 'PUT',
        url: `api/boats/${boatId}/modules`,
        data: {
            modules,
        },
    }),
};

export const addModule = async (boatId: string, module: Module<ModuleDataType>): Promise<Module<ModuleDataType>> => {
    const { data }: AxiosResponse<Module<ModuleDataType>> = await Http(ModuleEndpoints.Add({ boatId, module }));

    return data;
};

export const updateAllModules = async (
    boatId: string,
    modules: Module<ModuleDataType>[],
): Promise<Module<ModuleDataType>> => {
    const { data }: AxiosResponse<Module<ModuleDataType>> = await Http(ModuleEndpoints.UpdateAll({ boatId, modules }));

    return data;
};

import { AxiosResponse } from 'axios';

import { Module, ModuleExtended, ModuleData } from 'modules/boats/Boat.Types';
import { Http } from 'util/http/Http';
import { EndpointFunction } from 'util/http/Endpoints';
import { ModuleDataType } from './Modules';

type ModuleEndpointLabels = 'Add' | 'Upsert' | 'Get';
export const ModuleEndpoints: Record<ModuleEndpointLabels, EndpointFunction> = {
    Add: ({ module }) => ({
        method: 'POST',
        url: `api/modules`,
        data: {
            ...module,
        },
    }),
    Upsert: ({ module }) => ({
        method: 'POST',
        url: `api/modules`,
        data: {
            ...module,
        },
    }),
    Get: ({ moduleId }) => ({
        method: 'GET',
        url: `api/modules/${moduleId}`,
    }),
};

export const addModule = async (boatId: string, module: Module<ModuleDataType>): Promise<Module<ModuleDataType>> => {
    const { data }: AxiosResponse<Module<ModuleDataType>> = await Http(ModuleEndpoints.Add({ boatId, module }));

    return data;
};

export const upsertModule = async (
    boatId: string,
    module: Pick<Module<any>, 'name' | 'description' | 'settings' | 'order'> & {
        id?: string;
        boatId: string;
        data?: ModuleData<any>[];
        type: string;
    },
): Promise<Module<any>> => {
    const { data }: AxiosResponse<Module<any>> = await Http(ModuleEndpoints.Upsert({ boatId, module }));

    return new Promise((res) => {
        setTimeout(() => {
            res(data);
        }, 3000);
    });
};

export const getModule = async (boatId: string, moduleId: string) => {
    const { data }: AxiosResponse<ModuleExtended<any>> = await Http(ModuleEndpoints.Get({ boatId, moduleId }));
    data.moduleOptions = data.moduleOptions.map(mo => {
        return {
            ...mo,
            ...mo.data,
        }
    });
    return data;
};

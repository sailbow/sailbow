import { AxiosResponse } from 'axios';

import { Boat, CreateBoat, Photo } from 'boats/Boat.Types';
import { BoatEndpoints, ImageEndpoints } from 'util/http/Endpoints';
import { Http } from 'util/http/Http';

export const getBannerImages = async (value: string, newPage: number): Promise<Photo[]> => {
    const { data }: AxiosResponse = await Http({
        ...ImageEndpoints.Search,
        params: {
            query: value,
            page: newPage,
        },
    });
    const photos: Photo[] = [];

    data.forEach((photo: any) => {
        photos.push({
            src: photo.url,
            width: 3,
            height: 2,
        });
    });

    return photos;
};

export const createBoatService = async (boat: CreateBoat): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http({
        ...BoatEndpoints.Create,
        data: { ...boat },
    });

    return data;
};

export const getBoatService = async (boatId: string): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http({
        method: BoatEndpoints.Get.method,
        url: `${BoatEndpoints.Get.url}/${boatId}`,
    });

    return data;
};

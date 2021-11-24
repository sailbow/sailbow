import axios, { AxiosResponse } from 'axios';
import { BoatEndpoints, ImageSearchEndpoints } from 'util/http/Endpoints';
import { BoatState, Photo } from 'boats/Boat.Types';
import { Http } from 'util/http/Http';

export const getPexelsImages = async (value: string, newPage: number): Promise<Photo[]> => {
    const { data }: AxiosResponse = await axios({
        method: ImageSearchEndpoints.Search.method,
        url: ImageSearchEndpoints.Search.url,
        headers: {
            Authorization: process.env.REACT_APP_PEXELS_API_KEY,
        },
        params: {
            query: value,
            per_page: 10,
            page: newPage,
        },
    });

    const photos: Photo[] = [];

    data.photos.forEach((photo: any) => {
        photos.push({
            src: photo.src.landscape,
            width: 3,
            height: 2,
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
        });
    });

    return photos;
};

export const createBoatService = async (boat: BoatState) => {
    const { data }: AxiosResponse<BoatState> = await Http({
        method: BoatEndpoints.Create.method,
        url: BoatEndpoints.Create.url,
        data: { ...boat },
    });

    return data;
};

import { Crew } from 'profile/Profile.Constants';

export enum BannerType {
    Color,
    Link,
}

export interface BoatState {
    name: string;
    description: string;
    banner: {
        type: BannerType;
        value: string;
        position?: number;
    };
    crew: Crew[];
}

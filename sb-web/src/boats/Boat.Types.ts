import { Crew } from 'profile/Profile.Constants';

export enum BannerType {
    Color,
    Link,
}

export interface BannerState {
    show?: boolean;
    type: BannerType;
    value: string;
    position?: number;
}

export interface BoatState {
    name: string;
    description?: string;
    banner: BannerState;
    crew: Crew[];
}

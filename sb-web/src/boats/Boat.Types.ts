import { RoleType } from 'modules/role/Role';

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

export interface Boat {
    id: string;
    name: string;
    description?: string;
    banner: BannerState;
    crew: Crew[];
}

export interface CreateBoat extends Omit<Boat, 'id'> {}

export interface Photo {
    src: string;
    width: number;
    height: number;
    photographer: string;
    photographerUrl: string;
}

export interface Crew {
    role: RoleType;
    email: string;
    name: string;
    id?: string;
    info?: string;
}

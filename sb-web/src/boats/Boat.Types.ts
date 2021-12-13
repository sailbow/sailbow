import { RoleType } from 'modules/role/Role';

export enum BannerType {
    Color = 'Color',
    Link = 'Link',
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

export interface BoatState {
    boat?: Boat;
    error?: any;
    loading: {
        create: boolean;
        get: boolean;
    };
    createOpen: boolean;
}

export interface CreateBoat extends Omit<Boat, 'id'> {}

export interface Photo {
    src: string;
    width: number;
    height: number;
}

export interface Crew {
    role: RoleType;
    email: string;
    name: string;
    id?: string;
    info?: string;
}

import { Layout } from 'react-grid-layout';

import { RoleType } from 'shared/role/Role';

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

export interface CreateBoat extends Omit<Boat, 'id' | 'anchors'> {}

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

export interface Comment {
    author: Crew;
    body: string;
    likes: Array<string>; // ids of crew members
}

export interface Widget {
    id: string;
    name: string;
    layout: Layout;
    responses: Array<string>; // ids of crew members
    comments: Array<Comment>;
    selected?: string; // after the votes, the one that is selected by the captain
    data: any; // data will look different for diff widgets
}

export interface Anchor {
    name: string;
    id: string;
    widgets: Widget[];
}

export interface Boat {
    id: string;
    name: string;
    description?: string;
    banner: BannerState;
    crew: Crew[];
    anchors: Anchor[];
}

export interface BoatState {
    boats?: Boat[];
    boat?: Boat;
    error?: any;
    loading: {
        create: boolean;
        get: boolean;
    };
    createOpen: boolean;
}

import { User } from 'shared/user/User';

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

// move to role
export enum Role {
    Captain = 'Captain',
    Assistant = 'Assistant',
    Sailor = 'Sailor',
}

// move to role
export enum RoleLabel {
    Captain = 'Captain',
    Assistant = 'Assistant',
    Sailor = 'Sailor',
}

export enum ModuleName {
    Date = 'date',
    Location = 'location',
}

export enum ModuleType {
    Date = 'Date',
    Location = 'Location',
}

export enum ModuleMode {
    View,
    Settings,
    Edit,
}

export interface CreateBoat extends Omit<Boat, 'id' | 'modules'> {}
export interface EditBoat extends Omit<Boat, 'modules'> {}

export interface Photo {
    src: string;
    width: number;
    height: number;
}

export interface CrewMember extends Pick<User, 'id' | 'email' | 'name'> {
    role: Role;
    info?: string;
}

export interface ModuleSettings {
    allowMultiple: boolean;
    anonymousVoting: boolean;
    deadline?: string;
    [key: string]: any;
}

export type ModuleData<T> = {
    id: string;
    votes: number;
    isEditing?: boolean;
    text: string; // text to be shown in widget option and manifest
    author: Pick<User, 'id' | 'email' | 'name'>;
    selected: boolean; // if this option is selected by the current user. will have to save it differently in DB
} & T;

export interface Module<T> {
    id: string;
    name: string;
    type: ModuleType;
    order: number;
    description: string;
    totalVotes: CrewMember[];
    data: ModuleData<T>[];
    settings: ModuleSettings;
    actionRequired?: boolean;
    finalizedOptionId?: string;
    creator: Pick<User, 'id' | 'email' | 'name'>;
}

export interface ModuleExtended<T> extends Module<T> {
    dataLoaded?: boolean;
    error?: any;
    loading: boolean;
    mode: ModuleMode;
}

export interface Modules<T> {
    [key: string]: ModuleExtended<T>;
}

export interface Boat {
    id: string;
    name: string;
    captain?: CrewMember;
    description?: string;
    banner: BannerState;
    crew: CrewMember[];
    modules: Modules<any>;
    role: Role;
}

export interface BoatState {
    boats?: Boat[];
    activeBoat?: Boat;
    error?: any;
    loading: {
        create: boolean;
        get: boolean;
        getAll: boolean;
    };
}

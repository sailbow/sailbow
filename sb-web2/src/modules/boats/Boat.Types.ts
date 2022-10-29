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
    votes: string[];
    isEditing?: boolean;
    author: Pick<User, 'id' | 'email' | 'name'>;
    selected: boolean;
    errors?: {
        [key: string]: string;
    };
} & T;

export interface Module<T> {
    id: string;
    name: string;
    type: ModuleType;
    order: number;
    description: string;
    totalVotes: CrewMember[];
    settings: ModuleSettings;
    actionRequired?: boolean;
    finalizedOptionId?: string;
    data: ModuleData<T>[];
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
    modules: ModuleExtended<any>[];
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

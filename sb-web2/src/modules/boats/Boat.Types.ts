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
    Captain = 'captain',
    Assistant = 'assistant',
    Sailor = 'sailor',
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
    Manifest = 'manifest',
    Widget = 'widget',
}

export interface CreateBoat extends Omit<Boat, 'id' | 'anchors'> {}

export interface Photo {
    src: string;
    width: number;
    height: number;
}

export interface Crew extends Pick<User, 'id' | 'email' | 'name'> {
    role: Role;
    info?: string;
}

export interface Comment {
    author: Crew;
    body: string;
    likes: Array<string>; // ids of crew members
}

export interface WidgetData {
    id: string;
    votes: number;
    voted: string | null; // id of the data that the user voted for. if not voted its null
    description?: string;
    author: Pick<User, 'id' | 'email' | 'name'>;
}

export interface Manifest {
    data: any;
    dataLoaded?: boolean;
}

export interface Widget {
    data: any;
    dataLoaded?: boolean;
}

export interface Module {
    id: string;
    name: ModuleName;
    order: number;
    actionRequired?: boolean;
    description: string;
    deadline?: Date; // will be used to send reminders
    totalVotes: number; // will need this to show percentage voted in the option
    confirmed?: string; // id of the widget data that is voted
}

export interface ModuleExtended extends Module {
    manifest?: Manifest;
    widget: Widget;
}

export interface Boat {
    id: string;
    name: string;
    description?: string;
    banner: BannerState;
    crew: Crew[];
    modules: ModuleExtended[];
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
    createOpen: boolean;
}

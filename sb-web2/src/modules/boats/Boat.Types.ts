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

export enum ModuleId {
    Static = 'static',
    Date = 'date',
    Location = 'location',
}

export enum WidgetId {
    Date = 'widget-date',
    Location = 'widget-location',
}

export const WidgetName = {
    [WidgetId.Date]: 'Date',
    [WidgetId.Location]: 'Location',
};

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

// export interface Crew {
//     role: RoleType;
//     email: string;
//     name: string;
//     id?: string;
//     info?: string;
// }

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
    option: string;
    votes: number;
    voted: string | null; // id of the data that the user voted for. if not voted its null
    description?: string;
}

export interface Widget {
    id: string;
    widgetId: WidgetId; // will be used to identify which widget
    responses: Array<Crew>; // members that have voted
    actionRequired?: boolean;
    description: string;
    deadline: Date; // will be used to send reminders
    data: Array<WidgetData>;
    selected: string | null; // id of the widget data that is voted
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
    modules: {
        id: ModuleId;
        order: number;
        widget: Widget;
    }[];
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

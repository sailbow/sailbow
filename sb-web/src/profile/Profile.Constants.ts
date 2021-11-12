import { RoleType } from 'modules/role/Role';

export interface Crew {
    role: RoleType;
    email: string;
    name: string;
    id?: string;
    info?: string;
}

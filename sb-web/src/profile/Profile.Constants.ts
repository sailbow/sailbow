import { Role } from 'components/role/Role';

export interface Crew {
    role: Role;
    email: string;
    name: string;
    id?: string;
    info?: string;
}

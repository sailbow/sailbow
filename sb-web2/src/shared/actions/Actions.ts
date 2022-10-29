import { Role } from 'modules/boats/Boat.Types';

export const Actions = {
    InviteCrewRoleAccess: [Role.Captain, Role.Assistant],
    EditBoatDetailsRoleAccess: [Role.Captain, Role.Assistant],
    DeleteBoatRoleAccess: [Role.Captain],
    FinalizeModuleOptionRoleAccess: [Role.Captain],
    BoatSettingsRoleAccess: [Role.Captain],
};

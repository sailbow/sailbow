import { FC } from 'react';

import { useAuthStore } from '@/modules/auth/Auth.Store';
import { Role } from '@/modules/boats/Boat.Types';

export const Actions = {
    InviteCrew: [Role.Captain, Role.Assistant],
    EditBoatDetails: [Role.Captain, Role.Assistant],
    DeleteBoat: [Role.Captain],
    FinalizeModuleOption: [Role.Captain],
    BoatSettings: [Role.Captain],
    BoatModuleSettings: [Role.Captain, Role.Assistant],
    PollOption: [Role.Captain, Role.Owner],
};

export interface ActionGuardProps {
    role?: Role;
    acceptedRoles?: Role[];
    ownerId?: string;
}

export const withActionsGuard = <T,>(Component: FC<T>) => {
    return ({ role, acceptedRoles, ownerId, ...props }: ActionGuardProps & T) => {
        const [{ user }] = useAuthStore();

        if (acceptedRoles && acceptedRoles.includes(Role.Owner) && !ownerId) {
            throw new Error('OwnerId is required when acceptedRoles has Owner role.');
        }

        if (role === undefined) return <Component {...(props as any)} />;
        if (acceptedRoles && ownerId && acceptedRoles.includes(Role.Owner) && user!.id === ownerId)
            return <Component {...(props as any)} />;
        if (role && acceptedRoles && acceptedRoles.includes(role)) return <Component {...(props as any)} />;

        return <></>;
    };
};

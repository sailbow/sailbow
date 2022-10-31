import { FC } from 'react';

import { Role } from 'modules/boats/Boat.Types';

export interface RoleGuardProps {
    role?: Role;
    acceptedRoles?: Role[];
}

export const withRoleGuard = <T,>(Component: FC<T>) => {
    return ({ role, acceptedRoles, ...props }: RoleGuardProps & T) => {
        if (role === undefined) return <Component {...(props as any)} />;
        if (role && acceptedRoles && acceptedRoles.includes(role)) return <Component {...(props as any)} />;

        return <></>;
    };
};

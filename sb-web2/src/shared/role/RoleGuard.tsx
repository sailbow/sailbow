import { FC } from 'react';

import { Role } from 'modules/boats/Boat.Types';

interface Props {
    role: Role;
    acceptedRoles: Role[];
}

export const withRoleGuard = <T,>(Component: FC<T>) => {
    return ({ acceptedRoles, ...props }: Props & T) => {
        if (acceptedRoles.includes(props.role)) return <Component {...(props as any)} />;

        return <></>;
    };
};

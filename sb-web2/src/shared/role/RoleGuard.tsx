import { FC } from 'react';

import { Role } from 'modules/boats/Boat.Types';

interface Props {
    role: Role;
    acceptedRoles: Role[];
}

export const withRoleGuard = <T,>(Component: FC<T>) => {
    return (props: Props & T) => {
        if (props.acceptedRoles.includes(props.role)) return <Component {...props} />;

        return <></>;
    };
};

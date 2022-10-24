import { FC } from 'react';

import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { CrewMember } from 'modules/boats/Boat.Types';

import './CrewGroup.scss';

interface Props {
    crew: CrewMember[];
    max?: number;
}

export const CrewGroup: FC<Props> = ({ crew, max = 8 }) => {
    return (
        <AvatarGroup size="sm" max={max} className="sb-crew-group">
            {crew.map((member) => {
                return <Avatar className="crew-avatar" name={member.name} />;
            })}
        </AvatarGroup>
    );
};

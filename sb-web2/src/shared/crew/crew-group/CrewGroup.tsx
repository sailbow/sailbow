import { FC } from 'react';

import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { CrewMember } from 'modules/boats/Boat.Types';

import './CrewGroup.scss';

interface Props {
    crew: CrewMember[];
    max?: number;
    onClick?: () => void;
}

export const CrewGroup: FC<Props> = ({ crew, max = 8, onClick }) => {
    return (
        <AvatarGroup size="sm" max={max} className="sb-crew-group" onClick={onClick}>
            {crew.map((member) => {
                return <Avatar className="crew-avatar" name={member.name} key={member.email} />;
            })}
        </AvatarGroup>
    );
};

import { FC } from 'react';

import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { CrewMember } from '@/modules/boats/Boat.Types';

import './CrewGroup.scss';

interface Props {
    crew: CrewMember[];
    max?: number;
    size?: 'sm' | 'md' | 'xs';
    onClick?: () => void;
}

export const CrewGroup: FC<Props> = ({ crew, max = 8, size = 'sm', onClick }) => {
    return (
        <AvatarGroup size={size} max={max} className="sb-crew-group" onClick={onClick}>
            {crew.map((member) => {
                return <Avatar className="crew-avatar" name={member.name} key={member.email} />;
            })}
        </AvatarGroup>
    );
};

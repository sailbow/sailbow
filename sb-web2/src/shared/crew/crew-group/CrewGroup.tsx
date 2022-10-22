import { FC } from 'react';

import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { Crew } from 'modules/boats/Boat.Types';

import './CrewGroup.scss';

interface Props {
    crew: Crew[];
}

export const CrewGroup: FC<Props> = ({ crew }) => {
    return (
        <AvatarGroup size="sm" max={8} className="sb-crew-group">
            {crew.map((member) => {
                return <Avatar className="crew-avatar" name={member.name} />;
            })}
        </AvatarGroup>
    );
};

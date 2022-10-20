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
            <Avatar className="crew-avatar" name="Ryan Florence" />
            <Avatar className="crew-avatar" name="Segun Adebayo" />
            <Avatar className="crew-avatar" name="Kent Dodds" />
            <Avatar className="crew-avatar" name="Prosper Otemuyiwa" />
            <Avatar className="crew-avatar" name="Christian Nwamba" />
        </AvatarGroup>
    );
};

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
            <Avatar className="crew-avatar" name="Ryan Florence" src="https://bit.ly/ryan-florence" />
            <Avatar className="crew-avatar" name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
            <Avatar className="crew-avatar" name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
            <Avatar className="crew-avatar" name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
            <Avatar className="crew-avatar" name="Christian Nwamba" src="https://bit.ly/code-beast" />
        </AvatarGroup>
    );
};

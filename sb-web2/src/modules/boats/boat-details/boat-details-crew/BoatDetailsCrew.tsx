import { FC } from 'react';

import { Avatar, AvatarGroup, Flex, Link } from '@chakra-ui/react';

import { Crew } from 'modules/boats/Boat.Types';
import { SbUserGroup } from 'shared/icons/Icons';

import { BoatDetailsItem } from '../boat-details-item/BoatDetailsItem';

interface Props {
    crew: Crew[];
}

export const BoatDetailsCrew: FC<Props> = ({ crew }) => {
    // you have to populate the users here

    return (
        <BoatDetailsItem icon={<SbUserGroup />} label="Crew (5)" confirmed>
            <Flex justifyContent="space-between" alignItems="center">
                <AvatarGroup size="sm" max={4}>
                    <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                    <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                    <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                    <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                    <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                </AvatarGroup>

                <Link fontSize="sm">Edit</Link>
            </Flex>
        </BoatDetailsItem>
    );
};

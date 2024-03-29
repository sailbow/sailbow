import React, { FunctionComponent } from 'react';

import { Flex, VStack } from '@chakra-ui/react';

import { UserCard } from 'modules/boats/common/user-card/UserCard';
import { CrewMember } from 'modules/boats/Boat.Types';

interface Props {
    crew: CrewMember[];
    actions?: boolean;
    onDelete?: ((email: string) => void) | null;
}

export const UserList: FunctionComponent<Props> = ({ actions, crew, onDelete }) => {
    return (
        <VStack spacing="4" w="100%">
            {crew.map((c: any) => (
                <Flex key={c.email} w="100%">
                    <UserCard user={c} actions={actions} onDelete={onDelete} />
                </Flex>
            ))}
        </VStack>
    );
};

UserList.defaultProps = {
    actions: false,
    onDelete: null,
};

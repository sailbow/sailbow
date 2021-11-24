import React, { FunctionComponent } from 'react';

import { Flex, VStack, HStack, Text, Avatar, Box, IconButton } from '@chakra-ui/react';
import { Role, RoleType } from 'modules/role/Role';
import { Crew } from 'boats/Boat.Types';
import { SbDeleteIcon } from 'util/icons/Icons';

interface UserCardProps {
    user: Crew;
    actions?: boolean;
    onDelete?: ((email: string) => void) | null;
}

export const UserCard: FunctionComponent<UserCardProps> = ({ user, actions, onDelete }) => {
    const onClick = () => {
        if (onDelete) {
            onDelete(user.email);
        }
    };

    return (
        <Flex justifyContent="space-between" w="100%">
            <Flex alignItems="center" overflow="hidden">
                <Avatar variant="square" name={user.name} size="sm" />
                <Box>
                    <Text fontWeight="normal" pl="4" isTruncated>
                        {user.name}
                    </Text>
                    <Text fontWeight="normal" pl="4" isTruncated fontSize="xs">
                        {user.info}
                    </Text>
                </Box>
            </Flex>
            <HStack pl="4" display={actions ? 'flex' : 'none'}>
                <Role user={user} />
                {user.role !== RoleType.Captain && (
                    <IconButton
                        aria-label="delete"
                        icon={<SbDeleteIcon />}
                        variant="ghost"
                        colorScheme="gray"
                        onClick={onClick}
                    />
                )}
            </HStack>
        </Flex>
    );
};

UserCard.defaultProps = {
    actions: false,
    onDelete: null,
};

interface UserListProps {
    crew: Crew[];
    actions?: boolean;
    onDelete?: ((email: string) => void) | null;
}

export const UserList: FunctionComponent<UserListProps> = ({ actions, crew, onDelete }) => {
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

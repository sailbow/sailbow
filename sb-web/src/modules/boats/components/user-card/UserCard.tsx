import React, { FunctionComponent } from 'react';
import { Avatar, Box, Flex, HStack, IconButton, Text } from '@chakra-ui/react';

import { Crew } from 'modules/boats/Boat.Types';
import { Role, RoleType } from 'shared/role/Role';
import { SbDeleteIcon } from 'util/icons/Icons';

interface Props {
    user: Crew;
    actions?: boolean;
    onDelete?: ((email: string) => void) | null;
}

export const UserCard: FunctionComponent<Props> = ({ user, actions, onDelete }) => {
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

import React, { FunctionComponent } from 'react';

import { Flex, VStack, Text, Avatar, Box } from '@chakra-ui/react';
import { Role } from 'modules/role/Role';
import { useBoat } from 'boats/Boat.Store';
import { Crew } from 'profile/Profile.Constants';

export const UserCard: FunctionComponent<{ user: Crew; actions?: boolean }> = ({ user, actions = false }) => {
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
            <Box pl="4" display={actions ? 'block' : 'none'}>
                <Role user={user} />
            </Box>
        </Flex>
    );
};

UserCard.defaultProps = {
    actions: false,
};

export const UserList: FunctionComponent<{ actions?: boolean }> = ({ actions }) => {
    const [{ crew }] = useBoat();

    return (
        <VStack spacing="4" w="100%">
            {crew.map((c: any) => (
                <Flex key={c.email} w="100%">
                    <UserCard user={c} actions={actions} />
                </Flex>
            ))}
        </VStack>
    );
};

UserList.defaultProps = {
    actions: false,
};

import { FunctionComponent } from 'react';
import { Avatar, Box, Flex, HStack, IconButton, Text } from '@chakra-ui/react';

import { CrewMember, Role } from '@/modules/boats/Boat.Types';
import { SbDeleteIcon } from 'shared/icons/Icons';
import { RoleSelect } from 'shared/role/Role';

interface Props {
    user: CrewMember;
    actions?: boolean;
    onDelete?: ((email: string) => void) | null;
}

export const CrewCard: FunctionComponent<Props> = ({ user, actions = true, onDelete }) => {
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
                    <Text fontWeight="normal" pl="4">
                        {user.name}
                    </Text>
                    <Text fontWeight="normal" pl="4" fontSize="xs">
                        {user.info}
                    </Text>
                </Box>
            </Flex>
            <HStack pl="4" display={actions ? 'flex' : 'none'}>
                <RoleSelect user={user} />
                {user.role !== Role.Captain && (
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

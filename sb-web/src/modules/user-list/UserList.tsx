import React, { FunctionComponent } from 'react';

import { Flex, VStack } from '@chakra-ui/react';
import { UserCard } from 'components/user-card/UserCard';
import { Role, RoleAction } from 'components/role/Role';
import { BoatActionType, useBoat } from 'boats/Boat.Store';

export const UserList: FunctionComponent = () => {
    const [{ crew }, dispatch] = useBoat();

    const onRoleChange = (role: number, data: any) => {
        switch (role) {
            case Role.Assistant: {
                console.log('change to assistant');
                break;
            }
            case Role.Sailor: {
                console.log('change to Sailor');
                break;
            }
            case RoleAction.Remove: {
                dispatch({ type: BoatActionType.RemoveCrew, payload: data });
                break;
            }
            default: {
                throw new Error(`Invalid role -- ${role}`);
            }
        }
    };
    return (
        <VStack spacing="4" w="100%">
            {crew.map((c: any) => (
                <Flex key={c.email} w="100%">
                    <UserCard user={c} onChange={onRoleChange} />
                </Flex>
            ))}
        </VStack>
    );
};

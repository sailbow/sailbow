import { FC } from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { BoatManifest } from '@/modules/boats/common/boat-manifest/BoatManifest';
import { Boat, Role } from '@/modules/boats/Boat.Types';
import { useSystem } from '@/modules/system/System.Store';
import { Actions } from 'shared/actions/Actions';
import { SbPlusIcon, SbUserGroup } from 'shared/icons/Icons';
import { CrewGroup } from 'shared/crew/crew-group/CrewGroup';
import { withActionsGuard } from 'shared/actions/Actions';

interface Props {
    boat: Boat;
}

const GuardedInviteButton = withActionsGuard(Button);

export const CrewManifest: FC<Props> = ({ boat }) => {
    const [, { openCrewNav, openCrewInviteModal }] = useSystem();

    return (
        <BoatManifest icon={<SbUserGroup />} label={`Crew (${boat.crew.length})`} finalized="Crew">
            <Flex w="100%" justifyContent="space-between" alignItems="center">
                <CrewGroup crew={boat.crew} onClick={openCrewNav} />
                <Flex gap="2" display={boat.role === Role.Captain ? 'flex' : 'none'}>
                    <GuardedInviteButton
                        size="sm"
                        rightIcon={<SbPlusIcon />}
                        variant="secondary"
                        colorScheme="gray"
                        onClick={openCrewInviteModal}
                        role={boat.role}
                        acceptedRoles={Actions.InviteCrew}
                    >
                        Invite
                    </GuardedInviteButton>
                </Flex>
            </Flex>
        </BoatManifest>
    );
};

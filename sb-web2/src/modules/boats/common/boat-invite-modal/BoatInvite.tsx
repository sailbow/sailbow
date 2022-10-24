import { FC } from 'react';

import { Box, Button } from '@chakra-ui/react';

import { useSystem } from 'modules/system/System.Store';
import { Modal } from 'shared/modal/Modal';
import { BoatShare } from '../boat-share/BoatShare';
import { Label } from 'shared/input/Label';

export const BoatInviteModal: FC = () => {
    const [{ crewInviteModalOpen }, { closeCrewInviteModal }] = useSystem();

    return (
        <Modal
            isOpen={crewInviteModalOpen}
            onClose={closeCrewInviteModal}
            title="Invite Crew"
            size="xl"
            positiveButton={<Button>Done</Button>}
        >
            <Box>
                <Label label="Share Link" />
                <BoatShare mode="none" />
            </Box>
            <Box pt="4">
                <Label label="Search Users" />
            </Box>
        </Modal>
    );
};

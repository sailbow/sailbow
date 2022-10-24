import { FC } from 'react';

import { Box, Button } from '@chakra-ui/react';

import { useSystem } from 'modules/system/System.Store';
import { BoatShare } from 'modules/boats/common/boat-share/BoatShare';
import { SbCheckMarkIcon } from 'shared/icons/Icons';
import { Label } from 'shared/input/Label';
import { Modal } from 'shared/modal/Modal';

export const BoatInviteModal: FC = () => {
    const [{ crewInviteModalOpen }, { closeCrewInviteModal }] = useSystem();

    return (
        <Modal
            isOpen={crewInviteModalOpen}
            onClose={closeCrewInviteModal}
            title="Invite Crew"
            size="xl"
            positiveButton={
                <Button rightIcon={SbCheckMarkIcon} onClick={closeCrewInviteModal}>
                    Done
                </Button>
            }
        >
            <Box>
                <Label label="Share Link" mb="2" />
                <BoatShare mode="none" />
            </Box>
            <Box pt="4">
                <Label label="Search Users" />
            </Box>
        </Modal>
    );
};

import React, { FunctionComponent } from 'react';

import { Box, Heading, Modal, ModalContent, ModalOverlay, Spinner, Text } from '@chakra-ui/react';

import { useProfile } from 'profile/Profile';

export const ProfileLoading: FunctionComponent = () => {
    const [profileContainer] = useProfile();

    return (
        <Modal isOpen={profileContainer.loading} onClose={() => console.log()} isCentered>
            <ModalOverlay />
            <ModalContent p="5">
                <Box textAlign="center">
                    <Heading fontSize="lg">Getting ready to sail...</Heading>
                    <Spinner color="teal" mt="8" size="xl" />
                    <Text fontSize="sm" mt="4">
                        Please wait while all the systems boot up!
                    </Text>
                </Box>
            </ModalContent>
        </Modal>
    );
};

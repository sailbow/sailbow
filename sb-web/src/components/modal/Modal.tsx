import React, { FunctionComponent, ReactNode } from 'react';

import {
    Heading,
    Modal as ChakraModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    IconButton,
} from '@chakra-ui/react';

import { Close } from 'util/Icons';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    positiveButton: JSX.Element;
    negativeButton?: JSX.Element | null;
    title: string;
    children: ReactNode | ReactNode[];
    bodyClass?: string;
    size: string;
}

export const Modal: FunctionComponent<Props> = ({
    isOpen,
    onClose,
    positiveButton,
    negativeButton,
    title,
    children,
    bodyClass,
    size,
}) => {
    return (
        <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
            <ModalOverlay />
            <ModalContent py="4">
                <ModalHeader d="flex" justifyContent="space-between" alignItems="center">
                    <Heading fontSize="3xl">{title}</Heading>
                    <IconButton
                        aria-label="modal-close"
                        variant="ghost"
                        colorScheme="gray"
                        fontSize="xl"
                        onClick={onClose}
                    >
                        <Close />
                    </IconButton>
                </ModalHeader>

                <ModalBody className={bodyClass}>{children}</ModalBody>

                <ModalFooter>
                    {positiveButton}
                    {negativeButton}
                </ModalFooter>
            </ModalContent>
        </ChakraModal>
    );
};

Modal.defaultProps = {
    bodyClass: '',
    negativeButton: null,
};

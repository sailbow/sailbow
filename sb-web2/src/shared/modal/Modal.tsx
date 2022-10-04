import { FunctionComponent, ReactNode } from 'react';

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

import { SbCloseIcon } from 'shared/icons/Icons';

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
        <ChakraModal isOpen={isOpen} onClose={onClose} size={size} autoFocus={false}>
            <ModalOverlay />
            <ModalContent py="2">
                <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
                    <Heading fontSize="2xl">{title}</Heading>
                    <IconButton
                        mr="-3"
                        aria-label="modal-close"
                        variant="ghost"
                        colorScheme="gray"
                        fontSize="2xl"
                        onClick={onClose}
                    >
                        <SbCloseIcon />
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

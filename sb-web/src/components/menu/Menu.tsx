import React, { FunctionComponent } from 'react';

import {
    Box,
    Avatar,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
} from '@chakra-ui/react';
import { SbClockIcon, SbCloseIcon, SbMenuIcon } from 'util/icons/Icons';

import 'components/menu/Menu';

interface Props {
    display: any;
}

export const Menu: FunctionComponent<Props> = ({ display }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box display={display}>
            <IconButton aria-label="menu" variant="ghost" colorScheme="gray" icon={<SbMenuIcon />} onClick={onOpen} />
            <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent className="sb-menu">
                    <DrawerHeader borderBottomWidth="1px" border="0" p="2" textAlign="right">
                        <IconButton
                            aria-label="close"
                            variant="icon"
                            icon={<SbCloseIcon />}
                            fontSize="2xl"
                            onClick={onClose}
                        />
                    </DrawerHeader>
                    <DrawerBody>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

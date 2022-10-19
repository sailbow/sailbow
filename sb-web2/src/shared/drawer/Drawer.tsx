import { FC, ReactNode } from 'react';

import {
    Drawer as ChakraDrawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerProps,
    Flex,
    Heading,
    IconButton,
} from '@chakra-ui/react';

import { SbCloseIcon } from 'shared/icons/Icons';

interface Props extends DrawerProps {
    children: ReactNode;
    title: string;
    extraHeaderButtons?: ReactNode;
    footer?: ReactNode;
}

export const Drawer: FC<Props> = ({ children, title, extraHeaderButtons, footer, ...drawerProps }) => {
    return (
        <ChakraDrawer {...drawerProps}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Heading fontSize="2xl">{title}</Heading>
                        <Flex>
                            {extraHeaderButtons}
                            <IconButton
                                mr="-3"
                                onClick={drawerProps.onClose}
                                aria-label="close-icon"
                                icon={<SbCloseIcon />}
                                colorScheme="gray"
                                fontSize="2xl"
                                variant="ghost"
                            />
                        </Flex>
                    </Flex>
                </DrawerHeader>

                <DrawerBody pb="8">{children}</DrawerBody>

                <DrawerFooter>{footer}</DrawerFooter>
            </DrawerContent>
        </ChakraDrawer>
    );
};

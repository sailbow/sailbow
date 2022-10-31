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
    title?: string;
    extraHeaderButtons?: ReactNode;
    footer?: ReactNode;
    mode?: 'menu';
}

export const Drawer: FC<Props> = ({ children, title, extraHeaderButtons, footer, mode, ...drawerProps }) => {
    return (
        <ChakraDrawer {...drawerProps} closeOnOverlayClick>
            <DrawerOverlay />
            <DrawerContent>
                {mode !== 'menu' && (
                    <DrawerHeader px="4">
                        <Flex alignItems="center" justifyContent="space-between">
                            <Heading fontSize="xl">{title}</Heading>
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
                )}

                <DrawerBody pb={mode !== 'menu' ? '8' : '4'} px={mode !== 'menu' ? { base: 4, md: 6 } : 0}>
                    {children}
                </DrawerBody>

                {footer && <DrawerFooter>{footer}</DrawerFooter>}
            </DrawerContent>
        </ChakraDrawer>
    );
};

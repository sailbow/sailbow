import { FC } from 'react';

import { Button, Box, Flex, FlexProps, IconButton, useColorModeValue, Text } from '@chakra-ui/react';

import { Logo, SbChevronLeftIcon, SbMenuIcon } from 'shared/icons/Icons';
import { SidebarWidth } from '../BoatLayout';

interface Props extends FlexProps {
    title: string;
    back?: () => void;
}

export const TopNav: FC<Props> = ({ title, children, back, ...rest }) => {
    return (
        <Box zIndex={998} position="fixed" top="0" w="100%" left="50%" transform="translateX(-50%)">
            <Flex
                ml={{ base: 0, md: SidebarWidth }}
                alignItems="center"
                bg={useColorModeValue('white', 'gray.900')}
                justifyContent={{ base: 'space-between' }}
                {...rest}
            >
                <Button
                    display={{ base: 'flex', md: 'none' }}
                    variant="icon"
                    aria-label="open menu"
                    icon={<SbMenuIcon />}
                    as={IconButton}
                />

                <Box display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    <Logo />
                </Box>

                {/* Non-Mobile Nav Items */}

                <Flex alignItems="center" display={{ base: 'none', md: 'flex' }}>
                    <Button
                        variant="icon"
                        as={IconButton}
                        icon={<SbChevronLeftIcon />}
                        ml="-4"
                        display={back ? 'flex' : 'none'}
                        onClick={back}
                    />

                    <Text pl="2" fontSize="xl" fontWeight="800">
                        {title}
                    </Text>
                </Flex>

                {children}
            </Flex>
        </Box>
    );
};

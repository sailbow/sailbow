import { FC, ReactNode, ReactText } from 'react';

import { Box, Flex, FlexProps, Icon, Text } from '@chakra-ui/react';

import { Color } from 'theme/colors/Colors';

interface Props extends FlexProps {
    icon: any;
    children: ReactNode;
    selected?: boolean;
    hoverColor?: string;
    show?: boolean;
}

export const NavItem: FC<Props> = ({ icon, children, selected, hoverColor, show = true, ...rest }) => {
    return (
        <Box
            className="nav-item"
            w="100%"
            display={show ? 'flex' : 'none'}
            borderLeftWidth="5px"
            borderColor={selected ? hoverColor || 'brand.primary' : 'transparent'}
            _hover={{ borderColor: hoverColor || 'brand.primary' }}
            color={selected ? 'brand.primary' : 'gray.300'}
            transition="border-color 0.2s ease-in-out"
        >
            <Flex
                w="100%"
                align="center"
                role="group"
                cursor="pointer"
                transition="0.2s ease-in-out"
                transitionProperty="color,background"
                _hover={{
                    bg: hoverColor || 'brand.primary',
                    color: 'brand.dark',
                }}
                {...rest}
                py="4"
            >
                {icon && <Icon mr="4" fontSize="xl" as={icon} />}
                <Box fontWeight="600" overflow="hidden">
                    {children}
                </Box>
            </Flex>
        </Box>
    );
};

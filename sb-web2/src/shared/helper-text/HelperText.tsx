import { FC, ReactNode } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import { SbBulbIcon } from 'shared/icons/Icons';

interface Props {
    children: ReactNode;
    m?: string;
    p?: string;
    color?: string;
}

export const HelperText: FC<Props> = ({ children, m = 6, p = 6, color = 'orange' }) => {
    return (
        <Flex
            p={p}
            bg={`${color}.100`}
            borderRadius="xl"
            m={m}
            className="sb-helper-text"
            justifyContent="center"
            alignItems="center"
        >
            <Box fontSize="2xl" mr="2">
                <SbBulbIcon />
            </Box>
            <Text>{children}</Text>
        </Flex>
    );
};

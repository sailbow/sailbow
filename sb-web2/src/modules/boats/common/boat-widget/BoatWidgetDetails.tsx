import { FC, ReactNode } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

interface Props {
    image: ReactNode;
    name: string;
    info: string;
}

export const BoatWidgetDetails: FC<Props> = ({ image, name, info }) => {
    return (
        <Flex w="100%" gap="4" alignItems="flex-start" py="1">
            <Box flex="0.2" width="80px" height="80px" borderRadius="xl">
                {image}
            </Box>
            <Box flex="0.8">
                <Text fontWeight="semibold">{name}</Text>
                <Text fontSize="sm">{info}</Text>
            </Box>
        </Flex>
    );
};

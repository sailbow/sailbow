import { FC, ReactNode } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

interface Props {
    image: ReactNode;
    label: string;
    info: string;
}

export const BoatWidgetDetails: FC<Props> = ({ image, label, info }) => {
    return (
        <Flex w="100%" gap="4" alignItems="flex-start">
            <Box flex="0.2" width="80px" height="80px">
                {image}
            </Box>
            <Box flex="0.8">
                <Text fontWeight="semibold">{label}</Text>
                <Text fontSize="sm">{info}</Text>
            </Box>
        </Flex>
    );
};

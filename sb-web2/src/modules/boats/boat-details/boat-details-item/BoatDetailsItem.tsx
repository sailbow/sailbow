import { FC, ReactNode } from 'react';

import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Icon, Text } from '@chakra-ui/react';

interface Props {
    icon: ReactNode;
    label: string;
    value?: string;
    isButton?: boolean;
    panel?: ReactNode;
}

export const BoatDetailsItem: FC<Props> = ({ icon, label, value, isButton = false, panel }) => {
    const DetailsItem: FC = () => {
        return (
            <Flex alignItems="center" w="100%" p="4" textAlign="start">
                <Box flexShrink="0" fontSize="xl">
                    {icon}
                </Box>
                <Flex pl="4" alignItems="center" w="100%" flexShrink="0">
                    <Text fontWeight="semibold" flex={value ? 0.3 : 1} flexShrink="0">
                        {label}
                    </Text>
                    <Text color="brand.secondary" pl="2" flex="0.7" flexShrink="0" noOfLines={1}>
                        {value}
                    </Text>
                </Flex>
            </Flex>
        );
    };
    return isButton ? (
        <AccordionItem border="0">
            <AccordionButton p="0">
                <DetailsItem />
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>{panel && <>{panel}</>}</AccordionPanel>
        </AccordionItem>
    ) : (
        <AccordionItem border="0">
            <DetailsItem />
        </AccordionItem>
    );
};

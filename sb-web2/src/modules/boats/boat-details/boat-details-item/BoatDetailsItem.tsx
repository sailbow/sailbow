import { FC, ReactNode } from 'react';

import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Text } from '@chakra-ui/react';

import './BoatDetailsItem.scss';

interface Props {
    icon: ReactNode;
    label: string;
    value?: string;
    isButton?: boolean;
    panel?: ReactNode;
    children?: ReactNode;
}

export const BoatDetailsItem: FC<Props> = ({ icon, label, value, isButton = false, panel, children }) => {
    const DetailsItem: FC = () => {
        return (
            <Box py={{ base: 3, md: 2 }}>
                <Flex alignItems="center" w="100%" textAlign="start" color="brand.secondary" pb="2">
                    <Box flexShrink="0" className="panel-icon" fontSize="sm">
                        {icon}
                    </Box>
                    <Flex pl="2" alignItems="center" w="100%" fontSize="sm">
                        <Text fontWeight="semibold" flex={value ? 0.3 : 1} flexShrink="0" className="panel-title">
                            {label}
                        </Text>
                    </Flex>
                </Flex>

                {children ? (
                    <>{children}</>
                ) : (
                    <Text noOfLines={1} fontWeight="semibold">
                        {value}
                    </Text>
                )}
            </Box>
        );
    };

    return isButton ? (
        <AccordionItem border="0" className="sb-boat-details-item">
            <AccordionButton p="0" _hover={{ bg: 'none' }}>
                <DetailsItem />
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="0">{panel && <>{panel}</>}</AccordionPanel>
        </AccordionItem>
    ) : (
        <AccordionItem border="0">
            <DetailsItem />
        </AccordionItem>
    );
};

import { FC, ReactNode } from 'react';

import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Flex,
    Text,
} from '@chakra-ui/react';

import './BoatDetailsItem.scss';

export interface ItemProps {
    confirmed?: boolean;
}

interface Props extends ItemProps {
    icon: ReactNode;
    label: string;
    value?: string;
    isButton?: boolean;
    panel?: ReactNode;
    children?: ReactNode;
    action?: ReactNode;
}

export const BoatDetailsItem: FC<Props> = ({
    action,
    icon,
    label,
    value,
    isButton = false,
    panel,
    children,
    confirmed,
}) => {
    const DetailsItem: FC = () => {
        return (
            <Box py="3">
                <Flex alignItems="center" w="100%" textAlign="start" color="brand.secondary" pb="2">
                    <Box flexShrink="0" className="panel-icon" fontSize="sm">
                        {icon}
                    </Box>
                    <Flex pl="2" alignItems="center" w="100%" fontSize="sm" justifyContent="space-between">
                        <Text fontWeight="semibold" className="panel-title">
                            {label}
                        </Text>
                        {action && action}
                    </Flex>
                </Flex>

                {confirmed ? (
                    <>
                        {children ? (
                            <>{children}</>
                        ) : (
                            <Text noOfLines={1} fontWeight="semibold">
                                {value}
                            </Text>
                        )}
                    </>
                ) : (
                    <Badge colorScheme="orange">In Discussion</Badge>
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

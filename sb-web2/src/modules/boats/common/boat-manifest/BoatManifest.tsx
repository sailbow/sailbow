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

import './BoatManifest.scss';

interface Props {
    icon: ReactNode;
    label: string;
    children: ReactNode | null;
    action?: ReactNode;
}

export const BoatManifest: FC<Props> = ({ action, icon, label, children }) => {
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

            {children ? <>{children}</> : <Badge colorScheme="orange">In Discussion</Badge>}
        </Box>
    );
};

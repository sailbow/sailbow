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
    isButton?: boolean;
    panel?: ReactNode;
    action?: ReactNode;
}

export const BoatManifest: FC<Props> = ({ action, icon, label, children, isButton }) => {
    const ManifestItem: FC = () => {
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

    return isButton ? (
        <AccordionItem border="0" className="sb-boat-manifest">
            <AccordionButton p="0" _hover={{ bg: 'none' }}>
                <ManifestItem />
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="0">{children}</AccordionPanel>
        </AccordionItem>
    ) : (
        <AccordionItem border="0" className="sb-boat-manifest-nonbutton">
            <ManifestItem />
        </AccordionItem>
    );
};

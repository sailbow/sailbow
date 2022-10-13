import { FC, ReactNode } from 'react';

import { Badge, Box, Flex, Skeleton, Text } from '@chakra-ui/react';

import './BoatManifest.scss';

interface Props {
    icon: ReactNode;
    label: string;
    children: ReactNode | null;
    action?: ReactNode;
    loading?: boolean;
}

export const BoatManifest: FC<Props> = ({ action, icon, label, children, loading }) => {
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
            {loading ? (
                <Skeleton startColor="gray.100" endColor="gray.300" h="24px" />
            ) : (
                <> {children ? <>{children}</> : <Badge colorScheme="orange">In Discussion</Badge>}</>
            )}
        </Box>
    );
};

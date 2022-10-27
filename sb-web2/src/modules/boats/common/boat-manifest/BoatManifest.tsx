import { FC, ReactNode } from 'react';

import { Badge, Box, BoxProps, Flex, Text } from '@chakra-ui/react';

import './BoatManifest.scss';
import { withLoading, withSkeleton } from 'util/guards/Loading';

interface Props extends BoxProps {
    icon: ReactNode;
    label: string;
    children: ReactNode | null;
    action?: ReactNode;
    loading?: boolean;
    finalized?: string;
}

const SkeletonWrapper = withSkeleton(Box);

export const BoatManifest: FC<Props> = ({ action, icon, label, children, loading, finalized, ...props }) => {
    return (
        <Box py="3" {...props}>
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
            <SkeletonWrapper loading={loading} skeletonHeight="24px">
                <> {finalized ? <>{children}</> : <Badge colorScheme="orange">In Discussion</Badge>}</>
            </SkeletonWrapper>
        </Box>
    );
};

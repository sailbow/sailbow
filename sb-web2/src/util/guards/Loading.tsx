import { FC } from 'react';

import { Skeleton, Spinner } from '@chakra-ui/react';

interface LoadingGuardProps {
    loading?: boolean;
    size?: 'sm' | 'lg' | 'xl' | 'md';
}

export const withLoading = <T,>(Component: FC<T>) => {
    return (props: LoadingGuardProps & T) =>
        !props.loading ? <Component {...props} /> : <Spinner color="brand.primary" size={props.size || 'sm'} />;
};

interface SkeletonGuardProps {
    loading?: boolean;
    skeletonHeight: string;
}

export const withSkeleton = <T,>(Component: FC<T>) => {
    return (props: SkeletonGuardProps & T) =>
        !props.loading ? (
            <Component {...props} />
        ) : (
            <Skeleton startColor="gray.100" endColor="gray.300" h={props.skeletonHeight} />
        );
};

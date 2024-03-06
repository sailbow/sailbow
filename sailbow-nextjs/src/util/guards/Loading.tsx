import { FC } from 'react';

import { Skeleton, Spinner } from '@chakra-ui/react';

interface LoadingGuardProps {
    loading?: boolean;
    size?: 'sm' | 'lg' | 'xl' | 'md';
}

export const withLoading = <T,>(Component: FC<T>) => {
    return ({ loading, size, ...props }: LoadingGuardProps & T) =>
        !loading ? <Component {...(props as any)} /> : <Spinner color="brand.primary" size={size || 'sm'} />;
};

interface SkeletonGuardProps {
    loading?: boolean;
    skeletonHeight: string;
}

export const withSkeleton = <T,>(Component: FC<T>) => {
    return ({ skeletonHeight, loading, ...props }: SkeletonGuardProps & T) =>
        !loading ? (
            <Component {...(props as any)} />
        ) : (
            <Skeleton startColor="gray.100" endColor="gray.300" h={skeletonHeight} />
        );
};

import { FC } from 'react';

import { Center, Spinner, Text } from '@chakra-ui/react';

interface Props {
    loading: boolean;
    message?: string;
}

export const PageSpinner: FC<Props> = ({ message, loading }) => {
    return (
        <Center flexDirection="column" h="inherit" display={loading ? 'flex' : 'none'}>
            <Spinner color="brand.primary" mt="8" size="xl" />
            {message && (
                <Text pt="2" fontWeight="700">
                    {message}
                </Text>
            )}
        </Center>
    );
};

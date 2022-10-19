import { FC, ReactNode } from 'react';

import { Box, Flex, Stack, Switch, Text } from '@chakra-ui/react';
import { useBoat } from 'modules/boats/Boat.Store';
import { ModuleSettings } from 'modules/boats/Boat.Types';

interface Props {
    id: string;
    settings: ModuleSettings;
    additionalSettings?: ReactNode;
}

export const BoatSettings: FC<Props> = ({ additionalSettings, settings }) => {
    const [, { saveWidgetSettings }] = useBoat();

    return (
        <Box w="100%" px="3">
            <Stack spacing="4">
                <Flex w="100%" justifyContent="space-between" alignItems="center">
                    <Text>Anonymous Voting</Text>
                    <Switch size="lg" isChecked={settings.anonymousVoting} />
                </Flex>
                <Flex w="100%" justifyContent="space-between" alignItems="center">
                    <Text>Allow Multiple Option Selection</Text>
                    <Switch size="lg" isChecked={settings.allowMultiple} />
                </Flex>
            </Stack>
            {additionalSettings}
        </Box>
    );
};

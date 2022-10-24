import { FC } from 'react';

import { Flex, VStack } from '@chakra-ui/react';

import { useSystem } from 'modules/system/System.Store';
import { Drawer } from 'shared/drawer/Drawer';
import { Input } from 'shared/input/Input';
import { SbSearchIcon } from 'shared/icons/Icons';

import { useBoat } from '../Boat.Store';
import { CrewCard } from './crew-card/CrewCard';
import { CrewMember } from '../Boat.Types';

export const BoatCrew: FC = () => {
    const [{ activeBoat }] = useBoat();
    const [{ crewNavOpen }, { closeCrewNav }] = useSystem();

    const onDelete = () => {
        console.log('deleted, call update boat');
    };

    return (
        <Drawer title="Your Crew" isOpen={crewNavOpen} onClose={closeCrewNav} size="md">
            <Input leftIcon={<SbSearchIcon />} />
            <VStack spacing="4" w="100%" mt="4">
                {activeBoat?.crew.map((c: CrewMember) => (
                    <Flex key={c.email} w="100%">
                        <CrewCard user={c} onDelete={onDelete} />
                    </Flex>
                ))}
            </VStack>
        </Drawer>
    );
};

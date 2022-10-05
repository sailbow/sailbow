import { FC } from 'react';

import {
    Button,
    Checkbox,
    Flex,
    IconButton,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Stack,
    Text,
} from '@chakra-ui/react';

import { SbFilterIcon } from 'shared/icons/Icons';

export const HomeFilter: FC = () => {
    return (
        <Popover variant="brand">
            <PopoverTrigger>
                <IconButton aria-label="filter" variant="icon" fontSize="2xl">
                    <SbFilterIcon />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent right="16px" p="2">
                <PopoverHeader>
                    <Text fontWeight="semibold">Filter By</Text>
                </PopoverHeader>
                <PopoverBody>
                    <Stack mb="4">
                        <Checkbox pt="2">Shared</Checkbox>
                        <Checkbox pt="2">Completed</Checkbox>
                    </Stack>
                </PopoverBody>
                <Flex justifyContent="space-between" alignItems="center" gap="4" p="3">
                    <Button w="100%" variant="ghost" colorScheme="gray">
                        Reset
                    </Button>
                    <Button w="100%">Apply</Button>
                </Flex>
            </PopoverContent>
        </Popover>
    );
};

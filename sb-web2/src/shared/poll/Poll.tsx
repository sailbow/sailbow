import { FC, ReactNode } from 'react';

import { Box, Button, Center, Divider, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { User } from 'shared/user/User';
import {
    SbCheckCircleIcon,
    SbCircleIcon,
    SbDeleteIcon,
    SbEditIcon,
    SbMinusCircleIcon,
    SbPlusIcon,
} from 'shared/icons/Icons';
import { WidgetData, WidgetMode } from 'modules/boats/Boat.Types';

interface Props {
    mode: WidgetMode;
    data: WidgetData[];
    onAddClick: () => void;
    getInputComponent: <T>(optionId: string, data: T) => JSX.Element;
    onOptionEdit: (optionId: string) => void;
    onRemoveOption: (optionId: string) => void;
}

export const Poll: FC<Props> = ({
    mode = WidgetMode.View,
    data,
    onAddClick,
    getInputComponent,
    onOptionEdit,
    onRemoveOption,
}) => {
    return (
        <Box className="sb-poll">
            <Stack spacing="4" w="100%">
                {data.map((item) => (
                    <Flex
                        key={item.id}
                        w="100%"
                        alignItems="center"
                        borderRadius="lg"
                        borderStyle="solid"
                        borderWidth="2px"
                        justifyContent="space-between"
                        borderColor={item.isEditing ? 'brand.primary' : 'brand.border-light'}
                        _hover={{ borderColor: 'brand.primary', cursor: 'pointer' }}
                        p="4"
                    >
                        {item.isEditing && mode !== WidgetMode.View && (
                            <Stack w="100%" spacing="4">
                                <>
                                    {getInputComponent(
                                        item.id,
                                        data.find((d) => d.id === item.id),
                                    )}
                                </>
                                <Flex justifyContent={{ base: 'space-between', md: 'flex-end' }} gap="4">
                                    <IconButton
                                        fontSize="xl"
                                        aria-label="delete-option"
                                        colorScheme="red"
                                        variant="ghost"
                                        size="sm"
                                        icon={<SbDeleteIcon />}
                                        onClick={() => onRemoveOption(item.id)}
                                    />
                                </Flex>
                            </Stack>
                        )}

                        {!item.isEditing && (mode === WidgetMode.View || mode === WidgetMode.Edit) ? (
                            <Flex alignItems="center" flexWrap="wrap">
                                <Box>{item.selected ? <SbCheckCircleIcon /> : <SbCircleIcon />}</Box>
                                <Box pl="2">
                                    <Text>{item.text}</Text>
                                    <Text>{item.description}</Text>
                                </Box>
                            </Flex>
                        ) : (
                            <></>
                        )}
                        {!item.isEditing && mode === WidgetMode.Edit && (
                            <Flex alignItems="center">
                                <IconButton
                                    fontSize="xl"
                                    aria-label="settings"
                                    colorScheme="gray"
                                    variant="ghost"
                                    size="sm"
                                    icon={<SbEditIcon />}
                                    onClick={() => onOptionEdit(item.id)}
                                />

                                <IconButton
                                    fontSize="xl"
                                    aria-label="settings"
                                    colorScheme="gray"
                                    variant="ghost"
                                    size="sm"
                                    icon={<SbMinusCircleIcon />}
                                    onClick={() => onRemoveOption(item.id)}
                                />
                            </Flex>
                        )}
                    </Flex>
                ))}
            </Stack>

            <Center my="4" display={mode === WidgetMode.Edit ? 'flex' : 'none'}>
                <Button variant="secondary" leftIcon={<SbPlusIcon />} colorScheme="gray" onClick={onAddClick}>
                    Add Option
                </Button>
            </Center>
        </Box>
    );
};

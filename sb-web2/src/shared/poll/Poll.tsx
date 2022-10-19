import { FC } from 'react';

import { Box, Button, Flex, IconButton, Skeleton, Stack, Text } from '@chakra-ui/react';

import { WidgetData, WidgetMode } from 'modules/boats/Boat.Types';
import {
    SbCheckMarkIcon,
    SbDeleteIcon,
    SbEditIcon,
    SbMinusCircleIcon,
    SbPlusIcon,
    SbRadioButtonOff,
    SbRadioButtonOn,
} from 'shared/icons/Icons';

export interface Props {
    mode: WidgetMode;
    data: WidgetData[];
    loading: boolean;
    onAddClick: () => void;
    getInputComponent: <T>(optionId: string, data: T) => JSX.Element;
    onOptionEdit: (optionId: string) => void;
    onRemoveOption?: <T>(data: T) => void;
    selectOption: (moduleId: string, optionId: string) => void;
    onSave: () => void;
}

export const Poll: FC<Props> = ({
    mode = WidgetMode.View,
    data,
    loading,
    onAddClick,
    getInputComponent,
    onOptionEdit,
    onRemoveOption,
    selectOption,
    onSave,
}) => {
    const onRemove = (optionId: string) => {
        const updatedData = [...data];
        const optionIdx = updatedData.findIndex((w) => w.id === optionId);

        if (optionIdx !== -1) {
            updatedData.splice(optionIdx, 1);
        }

        if (onRemoveOption) onRemoveOption(updatedData);
    };

    return !loading ? (
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
                        borderColor={item.isEditing || item.selected ? 'brand.primary' : 'brand.border-light'}
                        transition="transform 0.05s ease-in-out, border 0.15s ease-in-out"
                        _hover={{ borderColor: 'brand.primary', cursor: 'pointer' }}
                        _active={{ transform: !item.isEditing && mode !== WidgetMode.Edit ? 'scale(0.997)' : '' }}
                        p="4"
                        onClick={() => {
                            if (!item.isEditing || mode !== WidgetMode.Edit) {
                                selectOption('1', item.id);
                            }
                        }}
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
                                        onClick={() => onRemove(item.id)}
                                    />
                                </Flex>
                            </Stack>
                        )}

                        {!item.isEditing && (mode === WidgetMode.View || mode === WidgetMode.Edit) ? (
                            <Flex alignItems="center" flexWrap="wrap">
                                <Box color={item.selected ? 'brand.700' : 'inherit'} fontWeight="bold" fontSize="lg">
                                    {item.selected ? <SbRadioButtonOn /> : <SbRadioButtonOff />}
                                </Box>
                                <Box pl="2">
                                    <Text fontWeight="semibold">{item.text}</Text>
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
                                    onClick={() => onRemove(item.id)}
                                />
                            </Flex>
                        )}
                    </Flex>
                ))}
            </Stack>

            <Flex my="4" display={mode === WidgetMode.Edit ? 'flex' : 'none'} justifyContent="flex-end" gap={4}>
                <Button variant="secondary" leftIcon={<SbPlusIcon />} colorScheme="gray" onClick={onAddClick}>
                    Add Option
                </Button>
                <Button rightIcon={SbCheckMarkIcon} onClick={onSave} disabled={!data.length}>
                    Save
                </Button>
            </Flex>
        </Box>
    ) : (
        <Skeleton h="106px" startColor="gray.100" endColor="gray.300" />
    );
};

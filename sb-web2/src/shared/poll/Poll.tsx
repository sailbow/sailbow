import { PropsWithChildren } from 'react';

import { Box, Button, Flex, IconButton, Stack, Text } from '@chakra-ui/react';

import { ModuleData, ModuleMode } from 'modules/boats/Boat.Types';
import {
    SbCheckMarkIcon,
    SbDeleteIcon,
    SbEditIcon,
    SbMinusCircleIcon,
    SbPlusIcon,
    SbRadioButtonOff,
    SbRadioButtonOn,
} from 'shared/icons/Icons';
import { withSkeleton } from 'util/guards/Loading';

export interface Props<T> {
    mode: ModuleMode;
    data: ModuleData<T>[];
    loading: boolean;
    onAddOption: () => void;
    getInputComponent: <T>(optionId: string, data: T) => JSX.Element;
    onOptionEdit: <T>(data: T[]) => void;
    onRemoveOption?: <T>(data: T) => void;
    selectOption: (moduleId: string, optionId: string) => void;
    onSave: () => boolean;
}

const SkeletonWrapper = withSkeleton(Box);

export const Poll = <T extends {}>({
    mode = ModuleMode.View,
    data,
    loading,
    onAddOption,
    getInputComponent,
    onOptionEdit,
    onRemoveOption,
    selectOption,
    onSave,
}: PropsWithChildren<Props<T>>) => {
    const onRemove = (optionId: string) => {
        const updatedData = [...data];
        const optionIdx = updatedData.findIndex((w) => w.id === optionId);

        if (optionIdx !== -1) {
            updatedData.splice(optionIdx, 1);
        }

        if (onRemoveOption) onRemoveOption(updatedData);
    };

    const onEdit = (optionId: string) => {
        const newOptions = [...data];
        const optionIdx = newOptions.findIndex((p) => p.id === optionId);

        if (optionIdx !== -1) {
            newOptions[optionIdx].isEditing = true;
        }

        onOptionEdit(newOptions);
    };

    return (
        <SkeletonWrapper loading={loading} skeletonHeight="120px">
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
                            _active={{ transform: !item.isEditing && mode !== ModuleMode.Edit ? 'scale(0.997)' : '' }}
                            p="4"
                            onClick={() => {
                                if (!item.isEditing || mode !== ModuleMode.Edit) {
                                    selectOption('1', item.id);
                                }
                            }}
                        >
                            {item.isEditing && mode !== ModuleMode.View && (
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

                            {!item.isEditing && (mode === ModuleMode.View || mode === ModuleMode.Edit) ? (
                                <Flex alignItems="center" flexWrap="wrap">
                                    <Box
                                        color={item.selected ? 'brand.500' : 'inherit'}
                                        fontWeight="bold"
                                        fontSize="lg"
                                    >
                                        {item.selected ? <SbRadioButtonOn /> : <SbRadioButtonOff />}
                                    </Box>
                                    <Box pl="2">
                                        <Text fontWeight="semibold">{item.text}</Text>
                                        {/* <Text>{item.description}</Text> */}
                                    </Box>
                                </Flex>
                            ) : (
                                <></>
                            )}
                            {!item.isEditing && mode === ModuleMode.Edit && (
                                <Flex alignItems="center">
                                    <IconButton
                                        fontSize="xl"
                                        aria-label="settings"
                                        colorScheme="gray"
                                        variant="ghost"
                                        size="sm"
                                        icon={<SbEditIcon />}
                                        onClick={() => onEdit(item.id)}
                                    />

                                    <IconButton
                                        fontSize="xl"
                                        aria-label="settings"
                                        colorScheme="gray"
                                        variant="ghost"
                                        size="sm"
                                        icon={<SbMinusCircleIcon />}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemove(item.id);
                                        }}
                                    />
                                </Flex>
                            )}
                        </Flex>
                    ))}
                </Stack>

                <Flex mt="4" display={mode === ModuleMode.Edit ? 'flex' : 'none'} justifyContent="flex-end" gap={4}>
                    <Button variant="secondary" leftIcon={<SbPlusIcon />} colorScheme="gray" onClick={onAddOption}>
                        Add Option
                    </Button>
                    <Button rightIcon={SbCheckMarkIcon} onClick={() => onSave()} disabled={!data.length}>
                        Save
                    </Button>
                </Flex>
            </Box>
        </SkeletonWrapper>
    );
};

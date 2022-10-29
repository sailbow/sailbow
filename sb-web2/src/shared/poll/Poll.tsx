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
import { HelperText } from 'shared/helper-text/HelperText';

export interface Props<T> {
    mode: ModuleMode;
    data: ModuleData<T>[];
    loading: boolean;
    onAddOption: () => void;
    getInputComponent: <T>(optionId: string, data: T) => JSX.Element;
    onOptionEdit: <T>(data: T[]) => void;
    onRemoveOption?: <T>(data: T) => void;
    selectOption: (moduleId: string, optionId: string) => void;
    onSave: () => void;
    onOptionSave: (data: ModuleData<T>[]) => void;
    getText: (data: ModuleData<any>) => string;
    onValidate?: (data: ModuleData<T>) => { hasError: boolean; data: ModuleData<T> };
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
    onOptionSave,
    getText,
    onValidate,
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

    const onOptionSaveClick = (inputData: ModuleData<T>) => {
        if (onValidate) {
            const { hasError, data: validatedData } = onValidate(inputData);

            if (!hasError) {
                validatedData.isEditing = false;
            }

            return { hasError, data: validatedData };
        }

        return { hasError: false, data: inputData };
    };

    return (
        <SkeletonWrapper loading={false} skeletonHeight="200px">
            <Box className="sb-poll" transition="all 1s ease-in-out">
                <Stack spacing="4" w="100%">
                    {!data.length && (
                        <HelperText m="2" p="4">
                            Get started by adding options!
                        </HelperText>
                    )}
                    {data.map((item, idx) => (
                        <Flex
                            key={idx}
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
                                    <Flex justifyContent={{ base: 'space-between', md: 'flex-end' }} gap="2">
                                        <IconButton
                                            fontSize="xl"
                                            aria-label="delete-option"
                                            colorScheme="red"
                                            variant="ghost"
                                            icon={<SbDeleteIcon />}
                                            onClick={() => onRemove(item.id)}
                                        />
                                        <IconButton
                                            fontSize="xl"
                                            aria-label="save-option"
                                            colorScheme="green"
                                            variant="ghost"
                                            icon={SbCheckMarkIcon}
                                            onClick={() => {
                                                const { data: validatedData } = onOptionSaveClick(item);
                                                const fIdx = data.findIndex((i) => i.id === validatedData.id);

                                                data[fIdx] = validatedData;
                                                onOptionSave([...data]);
                                            }}
                                        />
                                    </Flex>
                                </Stack>
                            )}

                            {!item.isEditing && (mode === ModuleMode.View || mode === ModuleMode.Edit) ? (
                                <Flex
                                    alignItems="center"
                                    flexWrap="wrap"
                                    color={
                                        loading && item.id && item.id.startsWith('new-option') ? 'gray.300' : 'inherit'
                                    }
                                >
                                    <Box
                                        color={item.selected ? 'brand.500' : 'inherit'}
                                        fontWeight="bold"
                                        fontSize="lg"
                                    >
                                        {item.selected ? <SbRadioButtonOn /> : <SbRadioButtonOff />}
                                    </Box>
                                    <Box pl="2">
                                        <Text fontWeight="semibold">{getText(item)}</Text>
                                    </Box>
                                </Flex>
                            ) : (
                                <></>
                            )}
                            {!item.isEditing && mode === ModuleMode.Edit && (
                                <Flex
                                    alignItems="center"
                                    color={
                                        loading && item.id && item.id.startsWith('new-option') ? 'gray.300' : 'inherit'
                                    }
                                >
                                    <IconButton
                                        fontSize="xl"
                                        aria-label="settings"
                                        colorScheme="gray"
                                        variant="ghost"
                                        size="sm"
                                        disabled={loading}
                                        icon={<SbEditIcon />}
                                        onClick={() => onEdit(item.id)}
                                    />

                                    <IconButton
                                        fontSize="xl"
                                        aria-label="settings"
                                        colorScheme="gray"
                                        variant="ghost"
                                        size="sm"
                                        disabled={loading}
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
                    <Button
                        variant="secondary"
                        leftIcon={<SbPlusIcon />}
                        colorScheme="gray"
                        onClick={onAddOption}
                        disabled={loading}
                    >
                        Add Option
                    </Button>
                    <Button
                        isLoading={loading}
                        rightIcon={SbCheckMarkIcon}
                        onClick={() => {
                            let err = false;
                            const validatedDataArr: ModuleData<T>[] = [];

                            data.forEach((dataItem) => {
                                const { hasError, data: validatedData } = onOptionSaveClick(dataItem);
                                validatedDataArr.push({ ...validatedData });

                                if (hasError) {
                                    err = true;
                                }
                            });

                            onOptionSave([...validatedDataArr]);
                            if (!err) onSave();
                        }}
                        disabled={!data.length}
                    >
                        Save
                    </Button>
                </Flex>
            </Box>
        </SkeletonWrapper>
    );
};

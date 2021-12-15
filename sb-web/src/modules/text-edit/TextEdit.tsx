import React, { FunctionComponent, useState } from 'react';

import {
    Text,
    TextProps,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Heading,
    Flex,
    Button,
} from '@chakra-ui/react';

import { ToastActionType, useToast } from 'modules/toast/Toast';

interface Props extends TextProps {
    type: 'text' | 'heading';
    editable?: boolean;
    editElement?: JSX.Element;
    onSave?: () => void;
    onCancel?: () => void;
}

export const TextEdit: FunctionComponent<Props> = ({
    type,
    editable,
    editElement,
    onSave,
    onCancel,
    children,
    ...props
}) => {
    const [, dispatch] = useToast();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCancel = () => {
        setOpen(false);
        if (onCancel) {
            onCancel();
        }
    };

    const handleSave = async () => {
        if (onSave) {
            try {
                setLoading(true);
                await onSave();

                setOpen(false);
                setLoading(false);
                dispatch({ type: ToastActionType.ShowSuccess, text: 'Boat details successfully updated!' });
            } catch (err: any) {
                setLoading(false);
                dispatch({ type: ToastActionType.ShowError, text: 'Could not update boat details' });
            }
        }
    };

    const textRender = () => {
        const properties = {
            ...props,
            _hover: editable && !open ? { py: '2', bg: 'gray.100' } : {},
            bg: open && editable ? 'gray.100' : 'transparent',
            borderRadius: 'lg',
            transition: 'all 0.2s ease-in-out',
            cursor: editable ? 'pointer' : 'inherit',
            py: open ? '2' : '0',
        };

        switch (type) {
            case 'text':
                return <Text {...properties}>{children}</Text>;
            case 'heading':
                return <Heading {...properties}>{children}</Heading>;
            default:
                throw new Error('Invalid type. Should be "text" or "heading"');
        }
    };

    return editable ? (
        <Popover
            variant="brand"
            isLazy
            lazyBehavior="unmount"
            isOpen={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <PopoverTrigger>{textRender()}</PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    {editElement}
                    <Flex alignItems="center" justifyContent="end" pt="4">
                        <Button size="sm" variant="link" mr="4" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} isLoading={loading}>
                            Save
                        </Button>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    ) : (
        <>{textRender()}</>
    );
};

TextEdit.defaultProps = {
    editable: false,
    editElement: undefined,
    onSave: undefined,
    onCancel: undefined,
};

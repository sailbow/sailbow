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

interface Props extends TextProps {
    type: 'text' | 'heading';
    editable?: boolean;
    editElement?: JSX.Element;
    buttonText?: string;
}

export const TextEdit: FunctionComponent<Props> = ({ type, editable, editElement, buttonText, children, ...props }) => {
    const [open, setOpen] = useState<boolean>(false);

    const textRender = () => {
        const properties = {
            ...props,
            _hover: editable ? { py: '2', bg: 'gray.100' } : {},
            bg: open && editable ? 'gray.100' : 'transparent',
            borderRadius: 'lg',
            transition: 'all 0.2s ease-in-out',
            cursor: editable ? 'pointer' : 'inherit',
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
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <PopoverTrigger>{textRender()}</PopoverTrigger>
            <PopoverContent width="400px">
                <PopoverBody>
                    {editElement}
                    <Flex alignItems="center" justifyContent="end" pt="4">
                        <Button size="sm" variant="link" mr="2" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button size="sm">{buttonText}</Button>
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
    buttonText: 'Save',
};

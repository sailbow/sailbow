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

export const TextEdit: FunctionComponent<Props> = ({
    type,
    editable,
    editElement,
    buttonText = 'Save',
    children,
    ...props
}) => {
    const [open, setOpen] = useState<boolean>(false);

    if (!editable) {
        throw new Error('editElement and editActions can only be used when text is editable');
    }

    const TextRender: FunctionComponent = () => {
        const properties = {
            ...props,
            _hover: { bg: 'gray.100' },
            bg: open ? 'gray.100' : 'transparent',
            borderRadius: 'lg',
            p: '1',
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
            <PopoverTrigger>
                <TextRender />
            </PopoverTrigger>
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
        <Text {...props} p="2">
            {children}
        </Text>
    );
};

TextEdit.defaultProps = {
    editable: false,
    editElement: undefined,
    buttonText: 'Save',
};

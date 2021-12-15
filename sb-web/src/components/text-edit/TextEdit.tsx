import React, { FunctionComponent, useState } from 'react';

import { Text, TextProps, Popover, PopoverTrigger, PopoverContent, PopoverBody, Flex, Button } from '@chakra-ui/react';

interface Props extends TextProps {
    editable?: boolean;
    editElement?: JSX.Element;
    editActions?: JSX.Element;
}

export const TextEdit: FunctionComponent<Props> = ({ editable, editElement, editActions, children, ...props }) => {
    const [open, setOpen] = useState<boolean>(false);

    if (!editable && (editElement || editActions)) {
        throw new Error('editElement and editActions can only be used when text is editable');
    }

    return editable ? (
        <Popover
            variant="brand"
            isLazy
            lazyBehavior="unmount"
            isOpen={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <PopoverTrigger>
                <Text
                    {...props}
                    _hover={{ bg: 'gray.100' }}
                    bg={open ? 'gray.100' : 'transparent'}
                    transition="0.25s all ease-in-out"
                    borderRadius="lg"
                    p="2"
                >
                    {children}
                </Text>
            </PopoverTrigger>
            <PopoverContent width="400px">
                <PopoverBody>
                    {editElement}
                    {editActions}
                    {/* <Flex alignItems="center" justifyContent="end" pt="4">
                        <Button size="sm" variant="link" mr="2" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button size="sm">Save</Button>
                    </Flex> */}
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
    editActions: undefined,
};

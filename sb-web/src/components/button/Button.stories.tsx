import React from 'react';

import { Button, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { SbRightArrowIcon, Image } from 'util/Icons';

export default {
    title: 'Components/Button',
};

const Template: any = (args: any): JSX.Element => {
    const buttons = [
        {
            title: 'Primary Call-To-Action',
            comp: <Button>Primary Button</Button>,
        },
        {
            title: 'Primary With Icon',
            comp: <Button rightIcon={<SbRightArrowIcon />}>Primary Button</Button>,
        },
        {
            title: 'Outline',
            comp: <Button variant="outline">Outline Button</Button>,
        },
        {
            title: 'Outline with Icon',
            comp: (
                <Button variant="outline" rightIcon={<SbRightArrowIcon />}>
                    Outline Button
                </Button>
            ),
        },
        {
            title: 'Secondary Button',
            comp: <Button colorScheme="gray">Secondary Button</Button>,
        },
        {
            title: 'Secondary Button with Icon',
            comp: (
                <Button colorScheme="gray" leftIcon={<Image />}>
                    Secondary Button
                </Button>
            ),
        },
        {
            title: 'Link Button',
            comp: (
                <Button colorScheme="gray" variant="link">
                    Link Button
                </Button>
            ),
        },
        {
            title: 'Icon Button',
            comp: <IconButton aria-label="icon-button" colorScheme="gray" icon={<Image />} variant="ghost" />,
        },
    ];
    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Variant</Th>
                    <Th>Component</Th>
                </Tr>
            </Thead>
            <Tbody>
                {buttons.map((button) => (
                    <Tr>
                        <Td>{button.title}</Td>
                        <Td>{button.comp}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export const Primary = Template.bind({});

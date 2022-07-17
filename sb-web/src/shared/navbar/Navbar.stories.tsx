import React from 'react';

import { Navbar } from 'modules/navbar/Navbar';

export default {
    title: 'Modules/Navbar',
};

const Template: any = (args: any): JSX.Element => {
    return <Navbar {...args} />;
};

export const Primary = Template.bind({});

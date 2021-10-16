import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Divider, Flex, InputGroup, InputLeftAddon, Stack, Text } from '@chakra-ui/react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';

import { UserCard } from 'components/user-card/UserCard';
import { customStyles } from 'modules/user-search/UserSearchSelectStyles';
import { Envelope, Search } from 'util/Icons';

interface MockData {
    label: string;
    value: any;
}

const MOCK: MockData[] = [
    {
        label: 'Hrishikesh Paul',
        value: {
            id: 1,
            name: 'Hrishikesh Paul',
            info: 'Been with on 3 other boats',
        },
    },
    {
        label: 'Zack Gilbert',
        value: {
            id: 2,
            name: 'Zack Gilbert',
            info: 'Been with on 2 other boats',
        },
    },
];

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

export const UserSearch: FunctionComponent = () => {
    const [inputText, setInputText] = useState<string>('');
    const [invitedCrew, setInvitedCrew] = useState<MockData[]>([]);

    console.log({ inputText });

    const NoSelectOption: FunctionComponent<any> = (props) => {
        const { selectProps } = props;
        const { inputValue } = selectProps;

        const [validEmail, setValidEmail] = useState<boolean>(false);

        useEffect(() => {
            FormSchema.isValid({ email: inputValue }).then((isValid) => setValidEmail(isValid));
        }, [inputValue]);

        return (
            <components.NoOptionsMessage {...props}>
                <Box px="4" py="2" textAlign="left">
                    <span>
                        You have never sailed with <b>&lsquo;{inputValue}&lsquo;</b>
                    </span>
                    <Divider my="2" />
                    {validEmail ? (
                        <>
                            <Button borderRadius="lg" size="sm" variant="outline" rightIcon={<Envelope />}>
                                Send Invite
                            </Button>
                        </>
                    ) : (
                        <Text fontWeight="normal" fontSize="sm">
                            Enter a valid email to invite them via mail!
                        </Text>
                    )}
                </Box>
            </components.NoOptionsMessage>
        );
    };

    const Option: FunctionComponent = (props: any) => {
        const { data } = props;

        return (
            <components.Option {...props}>
                <UserCard name={data.label} info={data.value.info} showActions={false} />
            </components.Option>
        );
    };

    const getCrewMockFunction = (input: string) => {
        return new Promise<MockData[]>((resolve) => {
            setTimeout(() => {
                const results: MockData[] = [];
                MOCK.forEach((mock) => {
                    if (mock.label.toLowerCase().includes(input)) {
                        results.push(mock);
                    }
                });
                resolve(results);
            }, 2000);
        });
    };

    const removeFromList = (id: number) => {
        const updatedList = invitedCrew.filter((item) => item.value.id !== id);
        setInvitedCrew(updatedList);
    };

    return (
        <Stack spacing="4">
            <InputGroup variant="brand" alignItems="center">
                <InputLeftAddon>
                    <Search />
                </InputLeftAddon>
                <AsyncSelect
                    cacheOptions
                    loadOptions={getCrewMockFunction}
                    blurInputOnSelect
                    placeholder="Type name or email..."
                    styles={customStyles}
                    components={{
                        NoOptionsMessage: NoSelectOption,
                        Option,
                    }}
                    inputValue={inputText}
                    onInputChange={(value, action) => {
                        if (action.action === 'input-change') setInputText(value);
                    }}
                    value=""
                    onChange={(e: any) => {
                        setInputText('');
                        const updatedInvite = [{ ...e }, ...invitedCrew];

                        setInvitedCrew(updatedInvite);
                    }}
                    noOptionsMessage={({ inputValue }) => (!inputValue ? null : 'No results found')}
                />
            </InputGroup>
            {invitedCrew.map((crew) => (
                <Flex key={crew.value.id} w="100%">
                    <UserCard name={crew.label} _data={crew} remove={removeFromList} />
                </Flex>
            ))}
        </Stack>
    );
};

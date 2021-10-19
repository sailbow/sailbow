import React, { FunctionComponent, useEffect, useState, useRef } from 'react';

import { Box, Divider, Flex, InputGroup, InputLeftAddon, Stack, Text } from '@chakra-ui/react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';

import { Role, RoleAction } from 'components/role/Role';
import { UserCard } from 'components/user-card/UserCard';
import { customStyles } from 'modules/user-search/UserSearchSelectStyles';
import { Search } from 'util/Icons';

import 'modules/user-search/UserSearch.scss';

interface MockData {
    label: string;
    value: any;
}

const MOCK: MockData[] = [
    {
        label: 'Hrishikesh Paul',
        value: {
            email: 'hrpaul@iu.edu',
            name: 'Hrishikesh Paul',
            info: 'Been with on 3 other boats',
        },
    },
    {
        label: 'Zack Gilbert',
        value: {
            email: 'zagilbert@iu.edu',
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
    const [crewList, setCrewList] = useState<any[]>([]);

    const onCrewSelect = (e: any) => {
        setInputText('');
        const updatedInvite = [{ ...e.value }, ...crewList];

        setCrewList(updatedInvite);
    };

    const NoSelectOption: FunctionComponent<any> = (props) => {
        const { selectProps } = props;
        const { inputValue } = selectProps;
        const [validEmail, setValidEmail] = useState<boolean>(false);

        useEffect(() => {
            FormSchema.isValid({ email: inputValue }).then((isValid) => setValidEmail(isValid));
        }, [inputValue]);

        return (
            <components.NoOptionsMessage {...props}>
                <Box textAlign="left" p="0">
                    {validEmail ? (
                        <Box
                            onClick={() =>
                                onCrewSelect({
                                    value: { email: inputValue, name: inputValue },
                                })
                            }
                        >
                            <components.Option {...props}>
                                <UserCard
                                    showActions={false}
                                    user={{ email: inputValue, name: inputValue, info: 'Click to invite' }}
                                />
                            </components.Option>
                        </Box>
                    ) : (
                        <Box p="4">
                            <span>
                                You have never sailed with <b>{inputValue}</b>
                            </span>
                            <Divider my="2" />
                            <Text fontWeight="normal" fontSize="sm">
                                Enter a valid email and they will be invited to your Boat!
                            </Text>
                        </Box>
                    )}
                </Box>
            </components.NoOptionsMessage>
        );
    };

    const Option: FunctionComponent = (props: any) => {
        const { data } = props;

        return (
            <components.Option {...props}>
                <UserCard user={data.value} showActions={false} />
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

    const onRoleChange = (role: number, data: any) => {
        switch (role) {
            case Role.Assistant: {
                console.log('change to assistant');
                break;
            }
            case Role.Sailor: {
                console.log('change to Sailor');
                break;
            }
            case RoleAction.Remove: {
                const updatedList = crewList.filter((crew: any) => crew.email !== data.email);
                setCrewList(updatedList);
                break;
            }
            default: {
                throw new Error(`Invalid role -- ${role}`);
            }
        }
    };

    return (
        <Stack spacing="4" className="sb-user-search">
            <InputGroup variant="brand" alignItems="center">
                <InputLeftAddon pl="0" position="absolute">
                    <Search />
                </InputLeftAddon>
                <AsyncSelect
                    cacheOptions
                    classNamePrefix="sb-select-"
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
                    onChange={onCrewSelect}
                    noOptionsMessage={({ inputValue }) => (!inputValue ? null : 'No results found')}
                />
            </InputGroup>
            {crewList.map((crew: any) => (
                <Flex key={crew.email}>
                    <UserCard user={crew} onChange={onRoleChange} />
                </Flex>
            ))}
        </Stack>
    );
};

import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Divider, InputGroup, InputLeftAddon, Stack, Text } from '@chakra-ui/react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';

import { customStyles } from 'modules/boats/components/user-search/UserSearchSelectStyles';
import { SbSearchIcon } from 'shared/icons/Icons';
import { UserCard } from 'modules/boats/components/user-card/UserCard';
import { Crew, Role } from 'modules/boats/Boat.Types';
import { useDebounce } from 'util/hooks/Input';

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

interface CrewListItem {
    label: string;
    value: Crew;
}

interface Props {
    onChange: (crew: Crew) => void;
}

export const UserSearch: FunctionComponent<Props> = ({ onChange }) => {
    // const [, { getCrewByQuery }] = useBoat();
    const [inputText, setInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [debounce] = useDebounce();

    const onCrewSelect = (e: any) => {
        setInputText('');
        onChange({ ...e.value, role: Role.Sailor });
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
                                    user={{
                                        id: '',
                                        email: inputValue,
                                        name: inputValue,
                                        info: 'Click to invite',
                                        role: Role.Sailor,
                                    }}
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
                <UserCard user={data.value} />
            </components.Option>
        );
    };

    const showNoOpt = (inputValue: string): string | null => {
        if (!inputValue) return null;

        return inputText ? null : '';
    };

    const getCrew = async (query: string) => {
        setLoading(true);

        return new Promise((resolve) => {
            debounce(query, async (q) => {
                setTimeout(() => resolve(''), 1000);
                // const data = await getCrewByQuery(q);

                // setLoading(false);

                // if (!data) {
                //     return [];
                // }

                // const list: CrewListItem[] = [];

                // data.forEach((user: Crew) => {
                //     list.push({
                //         label: user.name,
                //         value: user,
                //     });
                // });

                // resolve(list);
            });
        });
    };

    return (
        <Stack spacing="4" className="sb-user-search">
            <InputGroup variant="brand" alignItems="center">
                <InputLeftAddon pl="0" position="absolute">
                    <SbSearchIcon />
                </InputLeftAddon>
                <AsyncSelect
                    cacheOptions
                    classNamePrefix="sb-select"
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
                    isLoading={loading}
                    onChange={onCrewSelect}
                    noOptionsMessage={({ inputValue }) => showNoOpt(inputValue)} // eslint-disable-line
                />
            </InputGroup>
        </Stack>
    );
};

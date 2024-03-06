import { FunctionComponent, useEffect, useState } from 'react';

import { Box, Divider, InputGroup, InputLeftAddon, Stack, Text } from '@chakra-ui/react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';

import { customStyles } from '@/modules/boats/common/user-search/UserSearchSelectStyles';
import { SbSearchIcon } from 'shared/icons/Icons';
import { UserCard } from '@/modules/boats/common/user-card/UserCard';
import { CrewMember, Role } from '@/modules/boats/Boat.Types';
import { useDebounce } from 'util/hooks/Input';
import { searchUsers, User } from 'shared/user/User';
import { CustomSelect } from 'shared/select/Select';

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

interface CrewListItem {
    label: string;
    value: string;
}

interface Props {
    onChange: (crew: CrewMember) => void;
}

export const UserSearch: FunctionComponent<Props> = ({ onChange }) => {
    // const [, { getCrewByQuery }] = useBoat();
    const [inputText, setInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [crew, setCrew] = useState<CrewListItem[]>([]);
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

    const getCrew = async (query: string): Promise<any> => {
        setLoading(true);

        // return new Promise((resolve) => {
        //     debounce(query, async (q) => {
        //         // setTimeout(() => resolve(''), 1000);
        //         const data = await searchUsers(q);

        //         setLoading(false);

        //         if (!data) {
        //             return [];
        //         }

        //         const list: CrewListItem[] = [];

        //         data.forEach((user: User) => {
        //             list.push({
        //                 label: user.name,
        //                 value: {
        //                     id: user.id,
        //                     // name: user.name,
        //                     // email: user.email,
        //                     // role: Role.Sailor,
        //                 },
        //             });
        //         });

        //         resolve(list);
        //     });
        // });
    };

    return (
        <Stack spacing="4" className="sb-user-search">
            <InputGroup variant="brand" alignItems="center">
                <InputLeftAddon pl="0" position="absolute" top='6px'>
                    <SbSearchIcon />
                </InputLeftAddon>
                <CustomSelect options={crew} isLoading={loading} />

                {/* <AsyncSelect
                    classNamePrefix="sb-select"
                    loadOptions={getCrew}
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
                    noOptionsMessage={({ inputValue }) => (!inputValue ? null : 'No results found')}
                /> */}
            </InputGroup>
        </Stack>
    );
};

import { ChangeEvent, FC, useState } from 'react';

import { Flex } from '@chakra-ui/react';

import { useAuthStore } from 'modules/auth/Auth.Store';
import { Module, ModuleData, ModuleExtended } from 'modules/boats/Boat.Types';
import { LocationSettings } from 'modules/boats/boat-modules/modules/location/LocationSettings';
import { LocationModuleDataType, getText } from 'modules/boats/boat-modules/modules/location/Location';
import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';

type DataType = ModuleData<LocationModuleDataType>;

export const LocationWidget: FC<ModuleExtended<LocationModuleDataType>> = (props) => {
    const { id, settings, data, dataLoaded } = props;
    const [widgetData, setWidgetData] = useState<DataType[]>(data);
    const [{ user }] = useAuthStore();

    const onDataChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const updatedWidgetData = [...widgetData];
        // update here
        setWidgetData([...updatedWidgetData]);
    };

    const onSave = () => {
        const updatedWidgetData = [...widgetData];
        let hasError = false;

        widgetData.forEach((d) => {
            const foundPollIdx = updatedWidgetData.findIndex((i) => i.id === d.id);
            // validate here

            if (foundPollIdx !== -1) {
                updatedWidgetData[foundPollIdx].isEditing = false;
            }
        });

        if (hasError) return false;

        setWidgetData([...updatedWidgetData]);

        return true;
    };

    const onRemoveOption: any = (updatedWidgetdata: DataType[]) => {
        setWidgetData([...updatedWidgetdata]);
    };

    const getInputComponent: any = (optionId: string, data: DataType) => {
        return <Flex w="100%" gap="4" flexDir={{ base: 'column', md: 'row' }}></Flex>;
    };

    return (
        <BoatWidget<DataType>
            {...props}
            moduleId={id}
            getText={getText}
            data={widgetData}
            settingsNode={<LocationSettings id={id} settings={settings} />}
            onOptionSave={onSave}
            onAddOption={() => {
                const newData: DataType = {
                    id: new Date().getTime().toString(),
                    author: { id: user?.id!, name: user!.name, email: user!.email },
                    selected: false,
                    votes: [],
                    isEditing: true,
                    errors: {},
                };

                setWidgetData([...widgetData, newData]);
            }}
            getInputComponent={getInputComponent}
            onOptionEdit={(data) => {
                setWidgetData(data as DataType[]);
            }}
            onRemoveOption={onRemoveOption}
        ></BoatWidget>
    );
};

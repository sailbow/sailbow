import { ChangeEvent, FC, useState } from 'react';

import { Flex } from '@chakra-ui/react';
    
import { useAuthStore } from 'modules/auth/Auth.Store';
import { Module, ModuleData } from 'modules/boats/Boat.Types';
import { LocationSettings } from 'modules/boats/boat-modules/modules/location/LocationSettings';
import { LocationModuleDataType, getText } from 'modules/boats/boat-modules/modules/location/Location';
import { BoatWidget } from 'modules/boats/common/boat-widget/BoatWidget';
    
type DataType = ModuleData<LocationModuleDataType>;
    
export const LocationWidget: FC<Module<LocationModuleDataType>> = (props) => {
    const { id, settings, data } = props;
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
                updatedWidgetData[foundPollIdx].text = getText(d);
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
        return (
            <Flex w="100%" gap="4" flexDir={{ base: 'column', md: 'row' }}>
                    
            </Flex>
        );
    };
    
    return (
        <BoatWidget<DataType>
            {...props}
            data={widgetData}
            settingsNode={<LocationSettings id={id} settings={settings} />}
            onSave={onSave}
            onAddOption={() => {
                const newData: DataType = {
                    id: new Date().getTime().toString(),
                    author: { id: user?.id!, name: user!.name, email: user!.email },
                    text: '',
                    selected: false,
                    votes: 0,
                    isEditing: true,
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
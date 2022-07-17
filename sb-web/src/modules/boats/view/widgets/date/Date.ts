import { Crew } from 'modules/boats/Boat.Types';

export interface DateWidgetData {
    startDate: string;
    endDate: string;
    responses: Array<string>;
    author: Crew;
}

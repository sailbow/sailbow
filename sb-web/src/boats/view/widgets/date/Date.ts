import { Crew } from 'boats/Boat.Types';

export interface DateWidgetData {
    startDate: string;
    endDate: string;
    responses: Array<string>;
    author: Crew;
}

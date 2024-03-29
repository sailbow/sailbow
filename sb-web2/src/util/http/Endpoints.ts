import { Method } from 'axios';

export interface Endpoint {
    method: Method;
    url: string;
}

export type EndpointFunction = (args?: any) => Endpoint;

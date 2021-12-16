import React, { FunctionComponent, useEffect } from 'react';

import { HttpLink, ApolloLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { ToastActionType, useToast } from 'modules/toast/Toast';
import { HttpStatus, LS, TokenStorageKeys } from 'util/http/Http';
import { GqlClient, GqlUri } from 'util/gql/Gql';

export const GqlInterceptor: FunctionComponent = () => {
    const [, dispatch] = useToast();

    useEffect(() => {
        const httpLink = new HttpLink({ uri: GqlUri });

        const authMiddleware = new ApolloLink((operation, forward) => {
            operation.setContext(({ headers = {} }) => ({
                headers: {
                    ...headers,
                    authorization: `Bearer ${LS.getItem(TokenStorageKeys.AT) || ''}`,
                },
            }));

            return forward(operation);
        });

        const errorMiddleware = onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );

            if (networkError) {
                console.log(`[Network error]: ${(networkError as any).statusCode}`);

                switch ((networkError as any).statusCode) {
                    case HttpStatus.BAD_REQUEST:
                        dispatch({ type: ToastActionType.ShowError, text: networkError.message });
                        break;
                    default:
                        dispatch({ type: ToastActionType.ShowError, text: 'Oops, something went wrong :(' });
                }
            }
        });

        GqlClient.setLink(from([authMiddleware, errorMiddleware, httpLink]));
    }, []); // eslint-disable-line
    return <></>;
};

import React, { FunctionComponent, useEffect } from 'react';

import { HttpLink, ApolloLink, from } from '@apollo/client';
import { onError, ErrorResponse } from '@apollo/client/link/error';

import { ToastActionType, useToast } from 'shared/toast/Toast';
import { GqlClient, GqlUri } from 'util/gql/Gql';
import { LS, LocalStorageKeys } from 'util/localstorage/LocalStorage';

export const GqlInterceptor: FunctionComponent = () => {
    const [, dispatch] = useToast();

    useEffect(() => {
        const httpLink = new HttpLink({ uri: GqlUri });

        const authMiddleware = new ApolloLink((operation, forward) => {
            operation.setContext(({ headers = {} }) => ({
                headers: {
                    ...headers,
                    authorization: `Bearer ${LS.getItem(LocalStorageKeys.AT) || ''}`,
                },
            }));

            return forward(operation);
        });

        const errorMiddleware = onError(({ graphQLErrors, networkError }: ErrorResponse) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );

            if (networkError) {
                console.log(`[Network error]: ${networkError.message}`);

                dispatch({ type: ToastActionType.ShowError, text: 'Oops, something went wrong :(' });
            }
        });

        GqlClient.setLink(from([authMiddleware, errorMiddleware, httpLink]));
    }, []); // eslint-disable-line
    return <></>;
};

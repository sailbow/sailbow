import { ApolloClient, InMemoryCache } from '@apollo/client';

export const GqlUri = `${process.env.REACT_APP_BASE_URL}/graphql`;

export const GqlClient = new ApolloClient({
    cache: new InMemoryCache(),
});

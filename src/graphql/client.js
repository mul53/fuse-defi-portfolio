import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const fuseswapClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/fuseio/fuseswap',
    }),
    cache: new InMemoryCache()
})

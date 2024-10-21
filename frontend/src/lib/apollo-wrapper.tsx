'use client';

import { ApolloProvider } from '@apollo/client';
import { useApollo } from './apollo-client';

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const apolloClient = useApollo(null);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

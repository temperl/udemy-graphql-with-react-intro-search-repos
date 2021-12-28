import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./client";
import { Query } from "react-apollo";
import { SEARCH_REPOSITORIES } from "./graphql";

const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア",
};

const App = () => {
  const [state, setState] = useState(VARIABLES);
  const { first, after, last, before, query } = state;
  return (
    <ApolloProvider client={client}>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ first, after, last, before, query }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          console.log(data);
          return <div></div>;
        }}
      </Query>
    </ApolloProvider>
  );
};

export default App;

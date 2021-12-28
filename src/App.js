import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./client";
import { Query } from "react-apollo";
import { SEARCH_REPOSITORIES } from "./graphql";

const PER_PAGE = 5;
const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア",
};

const App = () => {
  const [state, setState] = useState(DEFAULT_STATE);
  const { first, after, last, before, query } = state;

  const handleChange = (event) => {
    setState({
      ...DEFAULT_STATE,
      query: event.target.value,
    });
  };

  const goNext = (search) => {
    setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null,
      query: query,
    });
  };

  console.log({ query });

  return (
    <ApolloProvider client={client}>
      <form>
        <input value={query} onChange={handleChange} />
      </form>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ first, after, last, before, query }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          const search = data.search;
          const repositoryCount = search.repositoryCount;
          const repositoryUnit =
            repositoryCount === 1 ? "Repository" : "Repositories";
          const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`;

          return (
            <>
              <h2>{title}</h2>
              <ul>
                {search.edges.map((edge) => {
                  const node = edge.node;
                  return (
                    <li key={node.id}>
                      <a
                        href={node.url}
                        target="_blank"
                        rel="nopener noreferrer"
                      >
                        {node.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {search.pageInfo.hasNextPage === true ? (
                <button onClick={() => goNext(search)}>Next</button>
              ) : null}
            </>
          );
        }}
      </Query>
    </ApolloProvider>
  );
};

export default App;

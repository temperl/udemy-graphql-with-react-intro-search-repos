import React, { useState } from "react";
import client from "./client";
import { ApolloProvider, Mutation, Query } from "react-apollo";
import { ADD_STAR, SEARCH_REPOSITORIES } from "./graphql";

const StarButton = (props) => {
  const node = props.node;
  const totalCount = node.stargazers.totalCount;
  const viewerHasStarred = node.viewerHasStarred;
  const startCount = totalCount === 1 ? "1 start" : `${totalCount} starts`;
  const StarStatus = ({ addStar }) => {
    return (
      <button
        onClick={() => {
          addStar({
            variables: { input: { starrableId: node.id } },
          });
        }}
      >
        {startCount} | {viewerHasStarred ? "starred" : "-"}
      </button>
    );
  };
  return (
    <Mutation mutation={ADD_STAR}>
      {(addStar) => <StarStatus addStar={addStar} />}
    </Mutation>
  );
};

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

  const goPrevious = (search) => {
    setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor,
      query: query,
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
                      &nbsp;
                      <StarButton node={node} />
                    </li>
                  );
                })}
              </ul>
              {search.pageInfo.hasPreviousPage === true ? (
                <button onClick={() => goPrevious(search)}>Previous</button>
              ) : null}
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

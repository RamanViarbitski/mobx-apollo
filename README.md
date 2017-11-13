# mobx-apollo

# Installation

`yarn add mobx mobx-apollo`

# Usage

```javascript
import graphql from 'mobx-apollo';

type config = {
  client: apolloClientInstance, // new ApolloClient()
  query: gqlInstance, // gql`..`
  onError?: Function,
  onFetch?: Function, // invoked every time new data is fetched
  ...ApolloWatchQueryOptions // (see Apollo Client docs)
};

const store = new class {
  constructor() {
    this.allPosts = graphql({ ...config });

    // or lazy load it
    extendObservable(this, {
      get allPosts() {
        return graphql({ ...config });
      }
    });

    // when lazy loading, you should return graphql() without adding anything extra within the block to avoid over-fetching
    // utilize another computed for any extra checking or manipulation of data
  }
}();

autorun(() => console.log(toJS(store.allPosts.data.allPosts))); // [{ title: 'Hello World!' }]

type response = {
  error: ApolloError, // (see Apollo Client docs)
  loading: boolean,
  data: { queryAlias: Array<Object> },
  ref: ApolloObservableQuery // (see Apollo Client docs)
};
```

## Example

```javascript
import React, { Component } from 'react';

// create-react-app example
// yarn add apollo-client-preset graphql graphql-tag isomorphic-fetch mobx mobx-apollo mobx-react

import fetch from 'isomorphic-fetch';
import gql from 'graphql-tag';
import graphql from 'mobx-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { extendObservable, toJS } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';

global.fetch = fetch;

// schema built with Graphcool
// type Post implements Node {
//   createdAt: DateTime!
//   id: ID! @isUnique
//   updatedAt: DateTime!
//   title: String!
// }

// queries and mutations
const allPostsQuery = gql`
  {
    allPosts(orderBy: createdAt_DESC) {
      id
      title
    }
  }
`;

const createPostMutation = gql`
  mutation createPost($title: String!) {
    createPost(title: $title) {
      id
      title
    }
  }
`;

const uri = 'https://api.graph.cool/simple/v1/<project>';

const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache()
});

// building a mobx store
const postsStore = new class {
  constructor() {
    extendObservable(this, {
      get allPosts() {
        return graphql({ client, query: allPostsQuery });
      },
      get error() {
        return (this.allPosts.error && this.allPosts.error.message) || null;
      },
      get loading() {
        return this.allPosts.loading;
      },
      get posts() {
        return (this.allPosts.data && toJS(this.allPosts.data.allPosts)) || [];
      },
      get count() {
        return this.posts.length;
      }
    });
  }

  createPost = title =>
    client
      .mutate({
        mutation: createPostMutation,
        variables: { title },
        refetchQueries: [{ query: allPostsQuery }]
      })
      .then(() => console.warn('Created a new post ..'))
      .catch(error => console.error(error.message));
}();

// our main component
const Example = inject('postsStore')(
  observer(
    class extends Component {
      sayHello = () => this.props.postsStore.createPost('Hello World!');

      render() {
        const { error, loading, count, posts } = this.props.postsStore;

        if (error) console.error(error);
        else if (loading) console.warn('Loading ..');
        else if (count === 0) console.warn('No posts :(');
        else console.table(posts);

        return <button onClick={this.sayHello}>Say Hello</button>;
      }
    }
  )
);

// typically you would have multiple mobx stores here
const stores = { postsStore };

const ExampleWithState = () => (
  <Provider {...stores}>
    <Example />
  </Provider>
);

export default ExampleWithState;
```

## Recipes

[Pagination](https://github.com/sonaye/mobx-apollo/issues/6#issuecomment-328302121)

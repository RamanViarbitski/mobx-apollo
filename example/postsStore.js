import { query } from 'mobx-apollo';

import client from './client';
import { allPosts, createPost } from './queries';

export default new class {
  @query allPosts = { client, query: allPosts };

  createPost = title =>
    client.mutate({
      mutation: createPost,
      variables: { title },
      refetchQueries: [{ query: allPosts }]
    });
}();

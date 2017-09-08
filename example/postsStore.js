import { observable } from 'mobx';
import { query } from 'mobx-apollo';

import client from './client';
import { allPosts, createPost } from './queries';

export default new class {
  @observable allPostsLoading = true;
  @observable allPostsError = null;

  @query
  allPosts = {
    client,
    query: allPosts,
    onFetch: (data, ref) => {
      ref.allPostsLoading = false;
      ref.allPostsError = null;
    },
    onError: (error, ref) => {
      ref.allPostsLoading = false;
      ref.allPostsError = error.message;
    }
  };

  createPost = title =>
    client.mutate({
      mutation: createPost,
      variables: { title },
      refetchQueries: [{ query: allPosts }]
    });
}();

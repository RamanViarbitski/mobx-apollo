import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';

@inject('postsStore')
@observer
export default (class extends Component {
  componentDidMount() {
    const { createPost } = this.props.postsStore;

    setTimeout(() => createPost('Hello World!').catch(error => console.log(error.message)), 2500);
  }

  render() {
    const { allPostsLoading, allPostsError, allPosts } = this.props.postsStore;

    console.log({ allPostsLoading, allPostsError });

    if (allPosts) allPosts.forEach(post => console.log(post.title));

    return null;
  }
});

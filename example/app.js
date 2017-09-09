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

    if (allPostsLoading) console.log('Loading ..');
    else if (allPostsError) console.log('Error', allPostsError);
    else if (allPosts && allPosts.length > 0) console.log(allPosts);
    else console.log('No records.');

    return null;
  }
});

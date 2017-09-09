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
    const { allPosts } = this.props.postsStore;

    if (allPosts.error) console.log('Error', allPosts.error);
    else if (allPosts.loading) console.log('Loading ..');
    else if (allPosts.data.length > 0) console.log(allPosts.data);
    else console.log('No records.');

    return null;
  }
});

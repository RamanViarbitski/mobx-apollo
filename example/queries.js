import gql from 'graphql-tag';

const postDetails = gql`
  fragment postDetails on Post {
    id
    title
  }
`;

export const allPosts = gql`
  {
    allPosts(orderBy: createdAt_DESC) {
      ...postDetails
    }
  }
  ${postDetails}
`;

export const createPost = gql`
  mutation createPost($title: String!) {
    createPost(title: $title) {
      ...postDetails
    }
  }
  ${postDetails}
`;

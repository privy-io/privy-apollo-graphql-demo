import { gql } from "@apollo/client";

export const typeDefs = gql`
  type User {
    createdAt: String!
    email: String!
    bookmarks: [Bookmark]
  }

  type Bookmark {
    name: String!
    url: String!
  }

  input BookmarkInput {
    name: String!
    url: String!
  }

  input SignUpInput {
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type SignUpPayload {
    user: User!
  }

  type SignInPayload {
    user: User!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    createBookmark(input: BookmarkInput!): Bookmark!
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
  }
`;

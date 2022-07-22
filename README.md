# Privy Apollo Graphql Demo

This demo is a fork of the [Apollo Server and Client Auth Example](https://github.com/vercel/next.js/tree/canary/examples/api-routes-apollo-server-and-client-auth) demo that uses Privy to store users and data and has been extended to add bookmarks.

In this app, you can:

1. Sign up\*, which stores your email and password hash with Privy
2. Sign in, which does a lookup against the stored users
3. Store bookmarks, which allows append-only updating of a bookmarks list

`*`: The auth flow of this app has not been audited and is built for the purposes of a demo. While data stored in Privy is secure, we do not recommend copying this auth flow for real-world usage.

## Privy Features

- [Backend-only Privy (using `privy-node` to authenticate with API key and secret)](https://docs.privy.io/guide/basic-concepts/authentication/auth-basics)
- [Storing data with `privy-node`](https://docs.privy.io/guide/basic-concepts/accessing-data)
- Storing and editing lists

## Setting up the Privy API Console

Head over to [https://www.console.privy.io/](https://www.console.privy.io/) and get set up with an account if you have not yet. You'll need to [set up five fields](https://docs.privy.io/guide/basic-concepts/setting-up-schema), `created-at`, `email`, `password-salt`, `password-hash`, and `bookmarks`. You'll need to make sure that the permissions are set so that `admin` can read and write each of these fields.

You'll need to copy your API key and secret into `.env.local`, using `.env.local.example` as a reference.

## Running

```sh
# Install dependencies
npm install

# Run!
npm run dev
```

## Reading the code

Data storage and fetching occurs in [apollo/resolvers.js](https://github.com/privy-io/privy-apollo-graphql-demo/tree/main/apollo/resolvers.js), with helper methods in [lib/user.ts](https://github.com/privy-io/privy-apollo-graphql-demo/tree/main/lib/user.ts) and [lib/bookmarks.ts](https://github.com/privy-io/privy-apollo-graphql-demo/tree/main/lib/bookmarks.ts). The rest of the code is mostly boilerplate from the base demo!

## About the technologies used

[Apollo](https://www.apollographql.com/client/) is a GraphQL client that allows you to easily query the exact data you need from a GraphQL server. In addition to fetching and mutating data, Apollo analyzes your queries and their results to construct a client-side cache of your data, which is kept up to date as further queries and mutations are run.

In this simple example, we integrate Apollo seamlessly with [Next.js data fetching methods](https://nextjs.org/docs/basic-features/data-fetching) to fetch queries in the server and hydrate them in the browser.

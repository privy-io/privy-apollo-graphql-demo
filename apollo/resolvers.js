import { AuthenticationError, UserInputError } from "apollo-server-micro";
import {
  createUser,
  findUser,
  getPasswordHash,
  validatePassword,
} from "../lib/user";
import { setLoginSession, getLoginSession } from "../lib/auth";
import { removeTokenCookie } from "../lib/auth-cookies";
import {
  createBookmark as createBookmarkHelper,
  getBookmarks,
} from "../lib/bookmarks";

export const resolvers = {
  Query: {
    async currentUser(_parent, _args, context, _info) {
      // Returns the user object for the currently-logged-in user
      try {
        // Validate auth token
        const session = await getLoginSession(context.req);

        if (session) {
          // We implicitly enforce access to only the current user object.
          // Since we are using the Privy API secret authentication, we are in
          // charge of managing access ourselves. This mirrors the Privy-default
          // `self` role, where when applied to fields allows a user to read
          // their own data.
          return findUser({ userId: session.email });
        }
      } catch (error) {
        console.error(error);
        throw new AuthenticationError(
          "Authentication token is invalid, please log in"
        );
      }
    },
  },
  User: {
    async bookmarks(_parent, _args, context, _info) {
      // If a `User` object with `bookmarks` is requested in graphql, this
      // resolver helps fetch those bookmarks.
      try {
        const session = await getLoginSession(context.req);

        if (session) {
          // We implicitly enforce access to only the current users bookmarks.
          // If we were to generalize this, we would need to respect the
          // graphql params to properly support arbitrary user/bookmark fetching
          return await getBookmarks({ userId: session.email });
        }
      } catch (error) {
        console.error(error);
        throw new AuthenticationError(
          "Authentication token is invalid, please log in"
        );
      }
    },
  },
  Mutation: {
    async signUp(_parent, args, _context, _info) {
      // Store a user in Privy
      const user = await createUser(args.input);
      return { user };
    },
    async signIn(_parent, args, context, _info) {
      // Fetch the user and password hash from Privy to check against
      const user = await findUser({ userId: args.input.email });
      const userPassHash = await getPasswordHash({ userId: args.input.email });

      if (
        !user ||
        !(await validatePassword(userPassHash, args.input.password))
      ) {
        throw new UserInputError("Invalid email and password combination");
      }

      const session = {
        email: user.email,
      };
      // Store auth in a cookie on the response
      await setLoginSession(context.res, session);

      return { user };
    },
    async signOut(_parent, _args, context, _info) {
      // Send a cookie-clearing response to sign out
      removeTokenCookie(context.res);
      return true;
    },
    async createBookmark(_parent, args, context, _info) {
      // Create a bookmark for the currently authenticated user
      try {
        const session = await getLoginSession(context.req);

        if (session) {
          return createBookmarkHelper({
            userId: session.email,
            bookmarkName: args.input.name,
            bookmarkUrl: args.input.url,
          });
        }
      } catch (error) {
        console.error(error);
        throw new AuthenticationError(
          "Authentication token is invalid, please log in"
        );
      }
    },
  },
};

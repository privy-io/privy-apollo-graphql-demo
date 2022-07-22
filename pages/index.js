import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql, useMutation, useQuery } from "@apollo/client";
import Field from "../components/field";

const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      createdAt
      email
      bookmarks {
        name
        url
      }
    }
  }
`;

const Bookmarks = ({ bookmarks }) => {
  if (!bookmarks) {
    return <p>You have no items bookmarked.</p>;
  }

  return (
    <ul>
      {bookmarks.map((bookmark) => {
        return (
          <li>
            {bookmark.name}:{" "}
            <a href={bookmark.url} target="_blank">
              {bookmark.url}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

const CreateBookmarkMutation = gql`
  mutation CreateBookmarkMutation($name: String!, $url: String!) {
    createBookmark(input: { name: $name, url: $url }) {
      name
      url
    }
  }
`;

const Index = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(CurrentUserQuery);
  const [createBookmark] = useMutation(CreateBookmarkMutation, {
    refetchQueries: [{ query: CurrentUserQuery }],
  });
  const currentUser = data?.currentUser;
  const shouldRedirect = !(loading || error || currentUser);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRedirect]);

  async function handleSubmit(event) {
    event.preventDefault();

    const nameElement = event.currentTarget.elements.name;
    const urlElement = event.currentTarget.elements.url;

    try {
      await createBookmark({
        variables: {
          name: nameElement.value,
          url: urlElement.value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (currentUser) {
    return (
      <div>
        <p>You're signed in as {currentUser.email}.</p>

        <Bookmarks bookmarks={currentUser.bookmarks} />

        <form onSubmit={handleSubmit}>
          <Field
            name="name"
            autoComplete="name"
            required
            label="Bookmark Name"
          />
          <Field name="url" autoComplete="url" required label="Bookmark URL" />
          <button type="submit">Save</button>
        </form>

        <Link href="/signout">
          <a>signout</a>
        </Link>
      </div>
    );
  }

  return <p>Loading...</p>;
};

export default Index;

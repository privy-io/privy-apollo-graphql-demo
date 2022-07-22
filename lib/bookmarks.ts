import { getClient } from "./privy";

type CreateBookmarkInput = {
  userId: string;
  bookmarkName: string;
  bookmarkUrl: string;
};

export async function createBookmark({
  userId,
  bookmarkName,
  bookmarkUrl,
}: CreateBookmarkInput) {
  const bookmark = {
    name: bookmarkName,
    url: bookmarkUrl,
  };

  const client = getClient();
  // Privy currently does not natively support storing objects, so we store
  // the bookmarks list as a string and JSON.parse/JSON.stringify whenever
  // we read/write to the field.
  const bookmarkData = await client.get(userId, "bookmarks");
  const bookmarks = bookmarkData ? JSON.parse(bookmarkData.text()) : [];
  bookmarks.push(bookmark);
  await client.put(userId, "bookmarks", JSON.stringify(bookmarks));

  return bookmark;
}

type GetBookmarkInput = {
  userId: string;
};

export async function getBookmarks({ userId }: GetBookmarkInput) {
  const client = getClient();
  const bookmarkData = await client.get(userId, "bookmarks");
  const bookmarks = bookmarkData ? JSON.parse(bookmarkData.text()) : null;
  return bookmarks;
}

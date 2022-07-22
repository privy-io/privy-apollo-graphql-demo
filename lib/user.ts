import { FieldInstance } from "@privy-io/privy-node";
import crypto from "crypto";
import { getClient } from "./privy";

const getField = (
  fieldInstances: (FieldInstance | null)[],
  fieldId: string
) => {
  // Helper to fetch a field, since Privy also returns information about the
  // field in the field object
  for (const instance of fieldInstances) {
    if (instance?.field_id === fieldId) {
      return instance.text();
    }
  }
};

type CreateUserInput = {
  email: string;
  password: string;
};

export async function createUser({ email, password }: CreateUserInput) {
  // Some DIY salt/hashing of the password before storing it. Note that this
  // code is not audited and should not be used in production applications
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  const client = getClient();
  const privyUser = await client.put(email, [
    { field: "created-at", value: new Date().toISOString() },
    { field: "email", value: email },
    { field: "password-hash", value: hash },
    { field: "password-salt", value: salt },
  ]);

  return {
    createdAt: getField(privyUser, "created-at"),
    email: getField(privyUser, "email"),
  };
}

type GetUserInput = {
  userId: string;
};

export async function findUser({ userId }: GetUserInput) {
  const client = getClient();
  const privyUser = await client.get(userId, ["created-at", "email"]);

  if (!privyUser) return null;
  return {
    email: getField(privyUser, "email"),
    createdAt: getField(privyUser, "created-at"),
  };
}

export async function getPasswordHash({ userId }: GetUserInput) {
  const client = getClient();
  const privyData = await client.get(userId, [
    "password-hash",
    "password-salt",
  ]);

  if (!privyData) return null;
  return {
    salt: getField(privyData, "password-salt"),
    hash: getField(privyData, "password-hash"),
  };
}

// Compare the password of an already fetched user for a potential match
export async function validatePassword(
  userPasswordHash: { salt: string; hash: string },
  inputPassword: string
) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, userPasswordHash.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = userPasswordHash.hash === inputHash;
  return passwordsMatch;
}

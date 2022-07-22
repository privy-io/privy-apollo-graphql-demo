import { PrivyClient } from "@privy-io/privy-node";

let _client: PrivyClient;

export const getClient = (): PrivyClient => {
  if (_client) return _client;

  _client = new PrivyClient(
    process.env.PRIVY_API_KEY || "",
    process.env.PRIVY_API_SECRET || ""
  );
  return _client;
};

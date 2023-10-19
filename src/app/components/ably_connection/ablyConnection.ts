import Spaces from "@ably/spaces";
import pkg from "ably";
const { Realtime } = pkg;

const ablyApiKey = process.env.NEXT_PUBLIC_ABLY_API_TOKEN;

export const createAblyConnection = async (clientName: string) => {
  const ably = new Realtime.Promise({ key: ablyApiKey, clientId: clientName });
  const spaces = new Spaces(ably);

  return spaces;
};

export const subscribeTheUser = async (userName: string, boardName: string) => {
  const spaces = await createAblyConnection(userName);

  const space = await spaces.get(boardName);

  await space.enter({ name: userName });

  return space;
};

export const unsubscribeTheUser = async (
  userName: string,
  boardName: string
) => {
  const spaces = await createAblyConnection(userName);

  const space = await spaces.get(boardName);

  await space.leave({ name: userName });

  return space;
};

import pkg from "ably";
import Spaces from "@ably/spaces";

const { Realtime } = pkg;

const ablyApiKey = process.env.NEXT_PUBLIC_ABLY_API_TOKEN;

export const createAblyConnection = async (clientName: string) => {
  const ably = new Realtime.Promise({ key: ablyApiKey, clientId: clientName });
  const spaces = new Spaces(ably);

  return spaces;
};

export const getSpace = async (clientName: string, boardName: string) => {
  const spaces = await createAblyConnection(clientName);

  const space = await spaces.get(boardName);

  return space;
};

export const subscribeTheUser = async (
  clientName: string,
  boardName: string
) => {
  const space = await getSpace(clientName, boardName);

  await space.enter({ name: clientName });

  return space;
};

export const unsubscribeTheUser = async (
  clientName: string,
  boardName: string
) => {
  const space = await getSpace(clientName, boardName);

  await space.leave({ name: clientName });

  return space;
};

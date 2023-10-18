import Spaces from "@ably/spaces";
import pkg from 'ably';
const { Realtime } = pkg;

export const createAblyConnection = async (clientName:string) => {
  const ably = new Realtime.Promise(
    { key: process.env.ABLY_API_TOKEN, clientId: clientName }
  )
  const spaces = new Spaces(ably);

  return spaces;

};
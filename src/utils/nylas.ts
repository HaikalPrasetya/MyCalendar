import Nylas from "nylas";
import { nylasConfig } from "./nylasConfig";

export const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: nylasConfig.apiUri,
});

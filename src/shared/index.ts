export * from "@censor1337/cfx-core/client";
import { isDuplicityVersion } from "../shared";
export const isServer = isDuplicityVersion();
export const isClient = !isServer;
export { Citizen } from "./Citizen";
export { Event, listenerType } from "./Event";
export { onTick, everyTick, clearTick } from "./Timer";

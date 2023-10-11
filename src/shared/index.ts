export * from "@censor1337/cfx-core/shared";
import { isDuplicityVersion } from "../shared";
export const isServer = isDuplicityVersion();
export const isClient = !isServer;
export { Citizen } from "./Citizen";
export { Event, listenerType } from "./Event";
export * from "./Timer";

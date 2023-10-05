import { Citizen } from "./Citizen";
import { Vector2, Vector3 } from ".";
import { hash } from ".";

export type listenerType = (...args: any[]) => void;
export interface EventData {
	eventName: string;
	listener: listenerType;
}

export interface IEventEmitter {
	eventHash: number;
	listenerId: number;
}

const events = new Map<number, EventListener>();

interface IFunctionId {
	id: number;
	listener: Function;
}

class EventListener {
	public readonly eventname: string;
	public readonly listeners = new Array<IFunctionId>();
	private listenerId = 0;
	private listener: listenerType;
	private netSafe: boolean;

	constructor(eventname: string, netSafe = false) {
		this.eventname = eventname;
		this.netSafe = netSafe;
		this.listener = (...args: any[]) => {
			this.onEventInvoke(...args);
		};

		Citizen.addEventListener(this.eventname, this.listener, this.netSafe);
	}

	private onEventInvoke(...args: any[]): void {
		for (const listener of this.listeners) {
			listener.listener(...args);
		}
	}

	public addListener(listener: Function, netSafe = false): number {
		if (netSafe && !this.netSafe) {
			Citizen.removeEventListener(this.eventname, this.listener);
			Citizen.addEventListener(this.eventname, this.listener, netSafe);
			this.netSafe = true;
		}
		this.listenerId++;
		this.listeners.push({
			id: this.listenerId,
			listener,
		});
		return this.listenerId;
	}

	public removeListener(listenerId: number): void {
		const index = this.listeners.findIndex((listener) => listener.id === listenerId);
		if (index === -1) return;
		this.listeners.splice(index, 1);
	}
}

function addEvent(eventname: string, listener: Function, netSafe = false): IEventEmitter {
	const hashName = hash(eventname);
	let eventInstance = events.get(hashName);
	if (!eventInstance) {
		eventInstance = new EventListener(eventname);
        events.set(hashName, eventInstance);
	}

	const listenerId = eventInstance.addListener(listener, netSafe);
	return { eventHash: hashName, listenerId };
}

function removeEvent(eventData: IEventEmitter) {
	const eventInstance = events.get(eventData.eventHash);
	if (!eventInstance) return;

	eventInstance.removeListener(eventData.listenerId);
}

export class EventBase {
	public static getClassFromArguments(...args: any[]): any[] {
		const newArgs: any[] = [];

		for (const arg of args) {
			const obj = this.getObjectClass(arg);
			newArgs.push(obj);
		}
		return newArgs;
	}

	protected static getObjectClass(obj: any): any {
		const objType = obj.type;
		if (!objType) return obj;
		switch (objType) {
			case Vector2.type: {
				return new Vector2(obj);
			}
			case Vector3.type: {
				return new Vector3(obj);
			}

			default: {
				return obj;
			}
		}
	}
}

export class Event extends EventBase {
	private eventName: string;
	private listener: listenerType;
	private event: IEventEmitter;
	private netSafe: boolean;
	private once: boolean;

	protected constructor(eventName: string, listener: listenerType, isNet: boolean, once: boolean) {
		super();
		this.eventName = eventName;
		this.netSafe = isNet;
		this.once = once;
		this.listener = (...args: any[]) => {
			listener(...args);
			if (this.once) this.destroy();
		};
		this.event = addEvent(this.eventName, this.listener, this.netSafe);
	}

	destroy(): void {
		removeEvent(this.event);
	}

	public static on(eventName: string, listener: listenerType): Event {
		const handler = (...args: any[]) => {
			listener(...this.getClassFromArguments(...args));
		};
		return new this(eventName, handler, false, false);
	}

	public static once(eventName: string, listener: listenerType): Event {
		return new this(eventName, listener, false, true);
	}

	public static off(event: Event): void {
		if (!event) throw new Error("Event is not defined");
		event.destroy();
	}

	public static emit(eventName: string, ...args: any[]): void {
		Citizen.emit(eventName, ...args);
	}
}

import { Citizen } from "./Citizen";
import { Vector2, Vector3 } from ".";
export type listenerType = (...args: any[]) => void;
export interface EventData {
	eventName: string;
	listener: listenerType;
}

export interface IEventEmitter {
	eventname: string;
	listenerId: number;
}

const events = new Map<string, EventEmitter>();

class EventEmitter {
	public readonly eventname: string;
	private readonly listeners = new Map<number, Function>();
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
		events.set(this.eventname, this);
	}

	private onEventInvoke(...args: any[]): void {
		this.listeners.forEach((listener: Function, id: number) => {
			listener(...args);
		});
	}

	public addListener(listener: Function, netSafe = false): IEventEmitter {
		if (netSafe && !this.netSafe) {
			Citizen.removeEventListener(this.eventname, this.listener);
			Citizen.addEventListener(this.eventname, this.listener, netSafe);
			this.netSafe = true;
		}
		this.listenerId++;
		this.listeners.set(this.listenerId, listener);
		return {
			eventname: this.eventname,
			listenerId: this.listenerId,
		};
	}

	public removeListener(listenerId: number): void {
		this.listeners.delete(listenerId);

        const eventInstance = events.get(this.eventname);
        if (!eventInstance) return;
        if (this.listeners.size > 0) return;
        events.delete(this.eventname);
	}
}

function addEvent(eventname: string, listener: Function, netSafe = false): IEventEmitter {
	let eventInstance = events.get(eventname);
	if (!eventInstance) {
		eventInstance = new EventEmitter(eventname);
	}

	return eventInstance.addListener(listener, netSafe);
}

function removeEvent(eventData: IEventEmitter) {
	const eventInstance = events.get(eventData.eventname);
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

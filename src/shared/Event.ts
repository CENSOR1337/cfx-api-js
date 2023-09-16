import { Citizen } from "./Citizen";
import { Vector2, Vector3 } from ".";
export type listenerType = (...args: any[]) => void;
export interface EventData {
	eventName: string;
	listener: listenerType;
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
		Citizen.addEventListener(this.eventName, this.listener, this.netSafe);
	}

	destroy(): void {
		Citizen.removeEventListener(this.eventName, this.listener);
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

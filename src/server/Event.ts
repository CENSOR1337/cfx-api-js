import { Citizen, Event as SharedEvent } from "../shared";
import * as cfx from "@censor/cfx-core/server";

declare var source: number; // cfx player source
type clientListenerType = (source: number, ...args: any[]) => void;

namespace ServerEventContext {
	export interface entityCreated {
		handle: number;
	}
	export interface entityCreating {
		handle: number;
	}
	export interface entityRemoved {
		handle: number;
	}
	export interface onResourceListRefresh {}
	export interface onResourceStart {
		resourceName: string;
	}
	export interface onResourceStarting {
		resourceName: string;
	}
	export interface onResourceStop {
		resourceName: string;
	}

	export interface onServerResourceStart {
		resourceName: string;
	}

	export interface onServerResourceStop {
		resourceName: string;
	}

	export interface playerConnecting {
		source: string;
		playerName: string;
		setKickReason: (reason: string) => void;
		deferrals: {
			defer: () => void;
			done: (failedReason?: string) => void;
			handover: (data: any) => void;
			presentCard: (card: string | object, cb: (data: any, rawData: string) => void) => void;
			update: (msg: string) => void;
		};
	}

	export interface playerEnteredScope {
		data: {
			for: string;
			player: string;
		};
	}

	export interface playerJoining {
		source: string;
		oldID: string;
	}

	export interface playerLeftScope {
		data: {
			for: string;
			player: string;
		};
	}

	export interface ptFxEvent {
		sender: number;
		data: {
			assetHash: number;
			axisBitset: number;
			effectHash: number;
			entityNetId: number;
			f100: number;
			f105: number;
			f106: number;
			f107: number;
			f109: boolean;
			f110: boolean;
			f111: boolean;
			f92: number;
			isOnEntity: boolean;
			offsetX: number;
			offsetY: number;
			offsetZ: number;
			posX: number;
			posY: number;
			posZ: number;
			rotX: number;
			rotY: number;
			rotZ: number;
			scale: number;
		};
	}

	export interface removeAllWeaponsEvent {
		sender: number;
		data: {
			pedId: number;
		};
	}

	export interface startProjectileEvent {
		sender: number;
		data: {
			commandFireSingleBullet: boolean;
			effectGroup: number;
			firePositionX: number;
			firePositionY: number;
			firePositionZ: number;
			initialPositionX: number;
			initialPositionY: number;
			initialPositionZ: number;
			ownerId: number;
			projectileHash: number;
			targetEntity: number;
			throwTaskSequence: number;
			unk10: number;
			unk11: number;
			unk12: number;
			unk13: number;
			unk14: number;
			unk15: number;
			unk16: number;
			unk3: number;
			unk4: number;
			unk5: number;
			unk6: number;
			unk7: number;
			unk9: number;
			unkX8: number;
			unkY8: number;
			unkZ8: number;
			weaponHash: number;
		};
	}

	export interface weaponDamageEvent {
		sender: number;
		data: {
			actionResultId: number;
			actionResultName: number;
			damageFlags: number;
			damageTime: number;
			damageType: number;
			f104: number;
			f112: boolean;
			f112_1: number;
			f120: number;
			f133: boolean;
			hasActionResult: boolean;
			hasImpactDir: boolean;
			hasVehicleData: boolean;
			hitComponent: number;
			hitEntityWeapon: boolean;
			hitGlobalId: number;
			hitGlobalIds: number[];
			hitWeaponAmmoAttachment: boolean;
			impactDirX: number;
			impactDirY: number;
			impactDirZ: number;
			isNetTargetPos: boolean;
			localPosX: number;
			localPosY: number;
			localPosZ: number;
			overrideDefaultDamage: boolean;
			parentGlobalId: number;
			silenced: boolean;
			suspensionIndex: number;
			tyreIndex: number;
			weaponDamage: number;
			weaponType: number;
			willKill: boolean;
		};
	}

	export interface playerDropped {
		source: number;
		reason: string;
	}

	export interface explosionEvent {
		sender: number;
		data: {
			f186: number;
			f208: number;
			ownerNetId: number;
			f214: number;
			explosionType: number;
			damageScale: number;
			posX: number;
			posY: number;
			posZ: number;
			f242: boolean;
			f104: number;
			cameraShake: number;
			isAudible: boolean;
			f189: boolean;
			isInvisible: boolean;
			f126: boolean;
			f241: boolean;
			f243: boolean;
			f210: number;
			unkX: number;
			unkY: number;
			unkZ: number;
			f190: boolean;
			f191: boolean;
			f164: number;
			posX224: number;
			posY224: number;
			posZ224: number;
			f240: boolean;
			f218: number;
			f216: boolean;
		};
	}
}

class Event extends SharedEvent {
	public static onClient(eventName: string, listener: clientListenerType, once = false): SharedEvent {
		const handler = (...args: any[]) => {
			listener(source, ...this.getClassFromArguments(...args));
		};
		return new SharedEvent(eventName, handler, true, once);
	}

	public static onceClient(eventName: string, listener: clientListenerType): SharedEvent {
		return Event.onClient(eventName, listener, true);
	}

	public static emitClient = Citizen.triggerClientEvent;

	public static emitClientLatent = Citizen.triggerLatentClientEvent;

	public static emitAllClients(eventName: string, ...args: any[]) {
		Citizen.triggerClientEvent(eventName, -1, ...args);
	}
	public static emitAllClientsLatent(eventName: string, bps: number, ...args: any[]) {
		Citizen.triggerLatentClientEvent(eventName, -1, bps, ...args);
	}
}

class ServerEvent extends Event {
	private static bindEvent<T>(eventName: string, argHandler: (...args: any[]) => any, handler: (ctx: T) => any): Event {
		return Event.on(eventName, (...args: any[]): void => {
			const ctx: T = argHandler(...args);
			const result = handler(ctx);
			if (result == false) cfx.cancelEvent();
		});
	}

	public static entityCreated(handler: (ctx: ServerEventContext.entityCreated) => any): Event {
		return this.bindEvent<ServerEventContext.entityCreated>("entityCreated", (handle: number) => ({ handle }), handler);
	}

	public static entityCreating(handler: (ctx: ServerEventContext.entityCreating) => any): Event {
		return this.bindEvent<ServerEventContext.entityCreating>("entityCreating", (handle: number) => ({ handle }), handler);
	}

	public static entityRemoved(handler: (ctx: ServerEventContext.entityRemoved) => any): Event {
		return this.bindEvent<ServerEventContext.entityRemoved>("entityRemoved", (handle: number) => ({ handle }), handler);
	}

	public static onResourceListRefresh(handler: (ctx: ServerEventContext.onResourceListRefresh) => any): Event {
		return this.bindEvent<ServerEventContext.onResourceListRefresh>("onResourceListRefresh", () => ({}), handler);
	}

	public static onResourceStart(handler: (ctx: ServerEventContext.onResourceStart) => any): Event {
		return this.bindEvent<ServerEventContext.onResourceStart>("onResourceStart", (resourceName: string) => ({ resourceName }), handler);
	}

	public static onResourceStarting(handler: (ctx: ServerEventContext.onResourceStarting) => any): Event {
		return this.bindEvent<ServerEventContext.onResourceStarting>("onResourceStarting", (resourceName: string) => ({ resourceName }), handler);
	}

	public static onResourceStop(handler: (ctx: ServerEventContext.onResourceStop) => any): Event {
		return this.bindEvent<ServerEventContext.onResourceStop>("onResourceStop", (resourceName: string) => ({ resourceName }), handler);
	}

	public static onServerResourceStart(handler: (ctx: ServerEventContext.onServerResourceStart) => any): Event {
		return this.bindEvent<ServerEventContext.onServerResourceStart>("onServerResourceStart", (resourceName: string) => ({ resourceName }), handler);
	}

	public static onServerResourceStop(handler: (ctx: ServerEventContext.onServerResourceStop) => any): Event {
		return this.bindEvent<ServerEventContext.onServerResourceStop>("onServerResourceStop", (resourceName: string) => ({ resourceName }), handler);
	}

	public static playerConnecting(handler: (ctx: ServerEventContext.playerConnecting) => any): Event {
		return this.bindEvent<ServerEventContext.playerConnecting>(
			"playerConnecting",
			(playerName: string, setKickReason: (reason: string) => void, deferrals: any) => ({ source, playerName, setKickReason, deferrals }),
			handler
		);
	}

	public static playerEnteredScope(handler: (ctx: ServerEventContext.playerEnteredScope) => any): Event {
		return this.bindEvent<ServerEventContext.playerEnteredScope>("playerEnteredScope", (data: any) => ({ data }), handler);
	}

	public static playerJoining(handler: (ctx: ServerEventContext.playerJoining) => any): Event {
		return this.bindEvent<ServerEventContext.playerJoining>("playerJoining", (oldID: string) => ({ source, oldID }), handler);
	}

	public static playerLeftScope(handler: (ctx: ServerEventContext.playerLeftScope) => any): Event {
		return this.bindEvent<ServerEventContext.playerLeftScope>("playerLeftScope", (data: any) => ({ data }), handler);
	}

	public static ptFxEvent(handler: (ctx: ServerEventContext.ptFxEvent) => any): Event {
		return this.bindEvent<ServerEventContext.ptFxEvent>("ptFxEvent", (sender: number, data: any) => ({ sender, data }), handler);
	}

	public static removeAllWeaponsEvent(handler: (ctx: ServerEventContext.removeAllWeaponsEvent) => any): Event {
		return this.bindEvent<ServerEventContext.removeAllWeaponsEvent>("removeAllWeaponsEvent", (sender: number, data: any) => ({ sender, data }), handler);
	}

	public static startProjectileEvent(handler: (ctx: ServerEventContext.startProjectileEvent) => any): Event {
		return this.bindEvent<ServerEventContext.startProjectileEvent>("startProjectileEvent", (sender: number, data: any) => ({ sender, data }), handler);
	}

	public static weaponDamageEvent(handler: (ctx: ServerEventContext.weaponDamageEvent) => any): Event {
		return this.bindEvent<ServerEventContext.weaponDamageEvent>("weaponDamageEvent", (sender: number, data: any) => ({ sender, data }), handler);
	}

	public static playerDropped(handler: (ctx: ServerEventContext.playerDropped) => any): Event {
		return this.bindEvent<ServerEventContext.playerDropped>("playerDropped", (reason: string) => ({ source, reason }), handler);
	}

	public static explosionEvent(handler: (ctx: ServerEventContext.explosionEvent) => any): Event {
		return this.bindEvent<ServerEventContext.explosionEvent>("explosionEvent", (sender: number, data: any) => ({ sender, data }), handler);
	}
}

export { Event, ServerEvent, ServerEventContext };

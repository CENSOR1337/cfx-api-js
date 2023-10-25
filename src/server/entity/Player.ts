import * as cfx from "@censor1337/cfx-core/server";
import { Event } from "../Event";
import { Entity } from "./Entity";

export class Player extends Entity {
	private constructor(source: number) {
		super(source);
	}

	public get handle(): number {
		return this.ped;
	}

	public static get all(): Array<Player> {
		const players = new Array<Player>();
		const num = cfx.getNumPlayerIndices();
		for (let i = 0; i < num; i++) {
			const playerId = cfx.getPlayerFromIndex(i);
			const player = Player.fromSource(playerId);
			players.push(player);
		}
		return players;
	}

	public get source(): number {
		return this.id;
	}

	public get src(): string {
		return String(this.id);
	}

	public static fromSource(src: number | string): Player {
		return new Player(Number(src));
	}

	public get valid(): boolean {
		return cfx.doesPlayerExist(this.src);
	}

	public get exists(): boolean {
		return this.valid;
	}

	public get ped(): number {
		return cfx.getPlayerPed(this.src);
	}

	public get tokens(): string[] {
		const tokens: string[] = [];
		const tokenCount = cfx.getNumPlayerTokens(this.src);
		for (let i = 0; i < tokenCount; i++) {
			tokens.push(cfx.getPlayerToken(this.src, i));
		}
		return tokens;
	}

	public get endpoint(): string {
		return cfx.getPlayerEndpoint(this.src);
	}

	public get name(): string {
		return cfx.getPlayerName(this.src);
	}

	public get isMuted(): boolean {
		return cfx.mumbleIsPlayerMuted(this.id);
	}

	public set isMuted(value: boolean) {
		cfx.mumbleSetPlayerMuted(this.id, value);
	}

	public get ping(): number {
		return cfx.getPlayerPing(this.src);
	}

	public isAceAllow(object: string): boolean {
		return cfx.isPlayerAceAllowed(this.src, object);
	}

	public drop(reason: string): void {
		reason = reason || "No reason provided";
		cfx.dropPlayer(this.src, reason);
	}

	public emit(event: string, ...args: any[]): void {
		Event.emitClient(event, this.id, ...args);
	}
}

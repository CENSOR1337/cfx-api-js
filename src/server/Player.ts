import * as cfx from "@censor/cfx-core/server";
import { Event } from "./Event";
import { Vector3 } from "@censor/cfx-core/server";

export class Player {
	protected type = "player";
	public readonly source: number;
	private constructor(source: number) {
		this.source = source;
	}

	public static *all(): IterableIterator<Player> {
		const indices = cfx.getNumPlayerIndices();
		for (let i = 0; i < indices; i++) {
			const src = cfx.getPlayerFromIndex(i);
			yield Player.fromSource(src);
		}
	}

	public get src(): string {
		return String(this.source);
	}

	public static fromSource(src: number | string): Player {
		return new Player(Number(src));
	}

	public exists(): boolean {
		return this.source !== 0;
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
		return cfx.mumbleIsPlayerMuted(this.source);
	}

	public set isMuted(value: boolean) {
		cfx.mumbleSetPlayerMuted(this.source, value);
	}

	public get ping(): number {
		return cfx.getPlayerPing(this.src);
	}

	public get pos(): Vector3 {
		return cfx.getEntityCoords(this.ped);
	}

	public isAceAllow(object: string): boolean {
		return cfx.isPlayerAceAllowed(this.src, object);
	}

	public drop(reason: string): void {
		reason = reason || "No reason provided";
		cfx.dropPlayer(this.src, reason);
	}

	public emit(event: string, ...args: any[]): void {
		Event.emitClient(event, this.source, ...args);
	}
}
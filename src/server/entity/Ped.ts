import * as cfx from "@censor1337/cfx-core/server";
import { Entity } from "./Entity";

export class Ped extends Entity {
	public static fromHandle(handle: number): Ped {
		if (cfx.getEntityType(handle) !== 1) throw new Error("Invalid handle type");

		return new Ped(handle);
	}

	public static get all(): Array<Ped> {
		const gamePeds = cfx.getAllPeds().filter((pedHandle: number) => !cfx.isPedAPlayer(pedHandle)) as Array<number>;
		return gamePeds.map((handle: number) => Ped.fromHandle(handle));
	}
}

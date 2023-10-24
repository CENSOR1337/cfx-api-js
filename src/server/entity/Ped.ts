import * as cfx from "@censor1337/cfx-core/server";
import { Entity } from "./Entity";

export class Ped extends Entity {
	public static fromHandle(handle: number): Ped {
		if (cfx.getEntityType(handle) !== 1) throw new Error("Invalid handle type");

		return new Ped(handle);
	}
}

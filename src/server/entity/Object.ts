import * as cfx from "@censor1337/cfx-core/server";
import { Entity } from "./Entity";

export class Object extends Entity {
	public static fromHandle(handle: number): Object {
		if (cfx.getEntityType(handle) !== 3) throw new Error("Invalid handle type");

		return new Object(handle);
	}

	public static get all(): Array<Object> {
		return cfx.getAllObjects().map((handle: number) => Object.fromHandle(handle));
	}
}

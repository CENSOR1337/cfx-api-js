import * as cfx from "@censor1337/cfx-core/server";
import { Entity } from "./Entity";

export class Vehicle extends Entity {
	public static fromHandle(handle: number): Vehicle {
		if (cfx.getEntityType(handle) !== 2) throw new Error("Invalid handle type");

		return new Vehicle(handle);
	}
}

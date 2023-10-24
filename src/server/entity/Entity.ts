import { WorldObject } from "../../shared/entity/WorldObject";
import * as cfx from "@censor1337/cfx-core/server";
import { Vector3 } from "@censor1337/cfx-core/server";

export class Entity extends WorldObject {
	public readonly id: number;
	constructor(id: number) {
		super();
		this.id = id;
	}

	public get handle(): number {
		return this.id;
	}

	public get pos(): Vector3 {
		return cfx.getEntityCoords(this.handle);
	}

	public get dimension(): number {
		return cfx.getEntityRoutingBucket(this.handle);
	}
}

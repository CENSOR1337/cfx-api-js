import { WorldObject } from "../../shared/entity/WorldObject";
import * as cfx from "@censor1337/cfx-core/server";
import { Vector3 } from "@censor1337/cfx-core/server";
import { Player } from ".";
import { Object } from ".";
import { Vehicle } from ".";
import { Ped } from ".";

export class Entity extends WorldObject {
	public readonly id: number;
	constructor(id: number) {
		super();
		this.id = id;
	}

	public get valid(): boolean {
		return cfx.doesEntityExist(this.handle);
	}

	public get exists(): boolean {
		return this.valid;
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

	public get netOwner(): Player | undefined {
		const owner = cfx.networkGetEntityOwner(this.handle);
		if (owner <= 0) return undefined;
		return Player.fromSource(owner);
	}

	public get firstOwner(): Player | undefined {
		const firstOwner = cfx.networkGetFirstEntityOwner(this.handle);
		if (firstOwner <= 0) return undefined;
		return Player.fromSource(firstOwner);
	}

	public set pos(pos: Vector3) {
		cfx.setEntityCoords(this.handle, pos.x, pos.y, pos.z, false, false, false, false);
	}

	public get rot(): Vector3 {
		return cfx.getEntityRotation(this.handle);
	}

	public set rot(rot: Vector3) {
		cfx.setEntityRotation(this.handle, rot.x, rot.y, rot.z, 0, false);
	}

	public set dimension(dimension: number) {
		cfx.setEntityRoutingBucket(this.handle, dimension);
	}

	public get model(): number {
		return cfx.getEntityModel(this.handle);
	}

	public static get all(): Array<Entity> {
		const objects = Object.all;
		const vehicles = Vehicle.all;
		const peds = Ped.all;
		return [...objects, ...vehicles, ...peds];
	}
}

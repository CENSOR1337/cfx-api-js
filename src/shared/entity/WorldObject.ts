import { Vector3 } from "@censor1337/cfx-core/server";

export abstract class WorldObject {
	public abstract get dimension(): number;
	public abstract get pos(): Vector3;
}

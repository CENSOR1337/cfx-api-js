import { Citizen } from "./Citizen";

class Tick {
	handle: number;

	constructor(callback: Function) {
		this.handle = Citizen.setTick(callback);
	}

	destroy() {
		Citizen.clearTick(this.handle);
	}
}

const onTick = function (callback: Function) {
	return new Tick(callback);
};

const clearTick = function (tick: Tick) {
	if (!tick) return;
	tick.destroy();
};

export { Tick, onTick, onTick as everyTick, clearTick };

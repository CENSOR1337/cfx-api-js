import { Citizen } from "./Citizen";

class Timer {
	public readonly timer: any;
	public readonly listener: Function;
	public readonly interval: number;
	public readonly isLoop: boolean;
	public readonly isTick: boolean;

	private _isDestroyed: boolean = false;

	constructor(listener: Function, interval: number, isLoop: boolean = false, isTick: boolean = false) {
		this.listener = listener;
		this.interval = interval;
		this.isLoop = isLoop;
		this.isTick = isTick;

		const fn = isTick ? Citizen.setTick : isLoop ? Citizen.setInterval : Citizen.setTimeout;
		this.timer = fn(() => {
			if (this._isDestroyed) return;
			this.listener();
		}, interval);
	}

	public get destroyed(): boolean {
		return this._isDestroyed;
	}

	destroy() {
		if (this._isDestroyed) return;
		this._isDestroyed = true;
		const fn = this.isTick ? Citizen.clearTick : this.isLoop ? Citizen.clearInterval : Citizen.clearTimeout;
		fn(this.timer);
	}
}

function clearTimer(timer: Timer): void {
	timer.destroy();
}

function onTick(callback: Function): Timer {
	return new Timer(callback, 0, false, true);
}

function setTimeout(callback: Function, ms: number = 0): Timer {
	return new Timer(callback, ms, false);
}

function setInterval(callback: Function, ms: number = 0): Timer {
	return new Timer(callback, ms, true);
}

export { onTick, onTick as everyTick, clearTimer as clearTick };
export { setTimeout, clearTimer as clearTimeout };
export { setInterval, clearTimer as clearInterval };

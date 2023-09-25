import { Citizen } from "./Citizen";

interface CitizenTimer {
	ref(): CitizenTimer;
	unref(): CitizenTimer;
	hasRef(): boolean;
	refresh(): CitizenTimer;
	[Symbol.toPrimitive](): number;
}

const onTick = function (callback: Function): number {
	return Citizen.setTick(callback);
};

const clearTick = function (tick: number) {
	Citizen.clearTick(tick);
};

function setTimeout<T extends any[]>(callback: (...args: T) => void, ms?: number, ...args: T): CitizenTimer {
	return Citizen.setTimeout(callback, ms, ...args);
}

function clearTimeout(timeout: CitizenTimer): void {
	//@ts-ignore
	return Citizen.clearTimeout(timeout);
}

export { CitizenTimer };
export { onTick, onTick as everyTick, clearTick };
export { setTimeout, clearTimeout };

import { EventEmitter } from "events";

// export const emitter = remember("emitter", () => new EventEmitter());

// remember not really ncessary with vite ?

export const emitter = new EventEmitter();

const Emitter = require("eventemitter3");

import {iEventEmitter} from "./models/iEvemtEmitter";

export class EventEmitter implements iEventEmitter {

    private emitter = new Emitter();

    emit(event: string, data?: any): void {
        this.emitter.emit(event,data);
    }

    on(event: string, callback: Function): void {
        this.emitter.on(event,callback);
    }

}
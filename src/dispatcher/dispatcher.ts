import { iDispatcher, DispatcherMessageListener, DispatcherAllListener } from "./models/iDispatcher";

export class Dispatcher implements iDispatcher {

    //listeners assigned to a specific message
    private messageListeners: {[key: string]: Array<DispatcherMessageListener>} = {};

    //listeners assigned to any message (message passed as param)
    private listeners: Array<DispatcherAllListener> = [];

    dispatch(message: string, data?: any): void {
        this.messageListeners[message] && this.messageListeners[message].forEach(callback => callback(data));
        this.listeners.forEach(callback => callback(message,data));
    }

    registerToAll(listener: DispatcherAllListener): void {
        this.listeners.push(listener);
    }

    registerToMessage(message: string, listener: DispatcherMessageListener): void {
        if (!this.messageListeners[message]) {
            this.messageListeners[message] = [];
        }
        this.messageListeners[message].push(listener);
    }

}
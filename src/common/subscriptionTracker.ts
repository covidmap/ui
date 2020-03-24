import {iSubscriptionEventTracker, iSubscriptionTracker} from "./models/iSubscriptionTracker";
import {Observable, Subscriber, Subscription} from "rxjs";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {DISPATCHER_MESSAGES} from "../dispatcher/dispatcher.messages";
import {LOG_LEVEL} from "../logger/models/iLog";

interface iCallbackRecord {
    obj: any;
    eventName: string,
    callback: Function;
}

interface iSubscriptionTrackerDependencies {
    dispatcher: iDispatcher
}

export class SubscriptionTracker implements iSubscriptionEventTracker {

    private subscriptions: Array<Subscription>;
    private eventCallbacks: Array<iCallbackRecord>;

    private modules: iSubscriptionTrackerDependencies;

    private owner: string;

    constructor(owner: string, modules: iSubscriptionTrackerDependencies) {
        this.owner = owner;
        this.modules = modules;

        this.subscriptions = [];
        this.eventCallbacks = [];
    }

    subscribeTo<T>(obs: Observable<T>, ...params: any): void {
        const subscription = <Subscription>obs.subscribe(...params);
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: this.owner+": Subscription created",
            data: {
                params: params
            },
            level: LOG_LEVEL.Debug
        });
        this.subscriptions.push(subscription);
    }

    addEventListenerTo(obj: any, eventName: string, callback: Function): void {
        obj.addEventListener(eventName,callback);
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: this.owner+": Event Listener registered",
            data: {
                eventName: eventName,
                callback: callback
            },
            level: LOG_LEVEL.Debug
        });
        this.eventCallbacks.push({
            obj,
            eventName,
            callback
        });
    }

    unsubscribeAll(): void {
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: this.owner+": Clearing subscriptions and events",
            data: {
                subscriptionsLength: this.subscriptions.length,
                eventsLength: this.eventCallbacks.length
            },
            level: LOG_LEVEL.Debug
        });

        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });

        this.eventCallbacks.forEach(cb => {
            cb.obj.removeEventListener(cb.eventName,cb.callback);
        });

        this.subscriptions = [];
        this.eventCallbacks = [];
    }
}
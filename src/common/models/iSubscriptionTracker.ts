import {Observable, Subscriber, Subscription} from "rxjs";

export interface iSubscriptionTracker {

    subscribeTo<T>(obs: Observable<T>,...params: any): void;

    unsubscribeAll(): void;

}

export interface iEventTracker {

    addEventListenerTo(obj: any, eventName: string, callback: Function): void;

    unsubscribeAll(): void;

}

export interface iSubscriptionEventTracker extends iEventTracker, iSubscriptionTracker {}
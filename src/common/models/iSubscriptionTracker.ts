import {Observable, Subscriber, Subscription} from "rxjs";

export interface iSubscriptionTracker {

    owner: string;

    subscribeTo<T>(obs: Observable<T>,...params: any): void;

    unsubscribeAll(): void;

}

export interface iEventTracker {

    owner: string;

    addEventListenerTo(obj: any, eventName: string, callback: Function): void;

    unsubscribeAll(): void;

}

export interface iSubscriptionEventTracker extends iEventTracker, iSubscriptionTracker {}
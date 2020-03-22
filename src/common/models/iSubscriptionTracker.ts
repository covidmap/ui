import {Observable, Subscriber, Subscription} from "rxjs";

export interface iSubscriptionTracker {

    subscribeTo<T>(obs: Observable<T>,...params: any): Subscription;

    unsubscribeAll(): void;

}
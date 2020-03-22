import {iSubscriptionTracker} from "../models/iSubscriptionTracker";
import {Observable, Subscriber, Subscription} from "rxjs";

export class SubscriptionTracker implements iSubscriptionTracker {

    private subscriptions: Array<Subscription> = [];

    subscribeTo<T>(obs: Observable<T>, ...params: any): Subscription {
        const subscription = <Subscription>obs.subscribe.apply(obs,params);
        this.subscriptions.push(subscription);
        return subscription;
    }

    unsubscribeAll(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }



}
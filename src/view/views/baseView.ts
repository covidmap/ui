import {iAddressFormatter} from "../../common/models/iAddressFormatter";

import {generateRandomString} from "../../util/uuid";

import {iSubscriptionTracker} from "../../common/models/iSubscriptionTracker";
import { iView, HtmlString } from "../models/iView";
import {iStore} from "../../store/models/iStore";
import {iDispatcher} from "../../dispatcher/models/iDispatcher";
import {iViewRegistry} from "../models/iViewRegistry";
import {SubscriptionTracker} from "../../common/subscriptionTracker";

export interface iBaseViewDependencies {
    dispatcher: iDispatcher,
    store: iStore,
    viewRegistry: iViewRegistry,
    addressFormatter: iAddressFormatter
}

interface iBaseViewModules extends iBaseViewDependencies {
    subscriptionTracker: iSubscriptionTracker,
}

export abstract class BaseView extends HTMLElement implements iView {
    private _ownTemplate: string;

    //ids which will be created and used by subclass to get / set values inside of spans
    private spanInterpolators: {[key: string]: string} = {};
    protected modules: iBaseViewModules;


    init(modules: iBaseViewDependencies) {
        this.modules = this.initModules(modules);

        this.id = this.id || this.getUniqueId();
        this._ownTemplate = this.doInit();
        this.innerHTML = this.template;
        this.onPlacedInDocument();
    }

    private initModules(modules: iBaseViewDependencies): iBaseViewModules {
        return <iBaseViewModules>Object.assign(modules,{
            subscriptionTracker: new SubscriptionTracker()
        });
    }

    get selector(): string {
        return this.modules.viewRegistry.selectors[this.constructor.name];
    }

    get template(): HtmlString {
        return `
            ${this._ownTemplate}
        `.trim()
            .replace("\r\n","\n")
            .replace("\n","");
    }

    /**
     * Create a new span element which will be used later to interpolate values
     * @param name
     * @param defaultValue
     */
    protected registerSpanInterpolator(name: string,defaultValue?: string): HtmlString {
        const id = this.getUniqueId();
        this.spanInterpolators[name] = id;
        return `<span id="${id}">${defaultValue || ""}</span>`;
    }

    /**
     * Update the html value of a span interpolator which was created
     * Throws error if span listener was not previously registered
     * @param name
     * @param newValue
     */
    protected updateSpanHtml(name: string,newValue: string | number): void {
        const id = this.spanInterpolators[name];
        if (!id) {
            throw new Error("No span interpolator with name "+name+" exists!");
        }

        document.getElementById(id)!.innerHTML = ""+newValue;
    }

    protected getSpanInterpolatorElement(name: string): HTMLSpanElement {
        const id = this.spanInterpolators[name];
        if (!id) {
            throw new Error("No span interpolator with name "+name+" exists!");
        }
        return document.getElementById(this.spanInterpolators[name])!;
    }

    protected getUniqueId(): string {
        return "e"+generateRandomString(10);
    }


    destroy() {
        if (this.modules) {
            this.doDestroySelf();
            this.modules.subscriptionTracker.unsubscribeAll();
        }
        // @ts-ignore
        this.parentNode.removeChild(this);
    }

    protected abstract doInit(): HtmlString;
    protected abstract onPlacedInDocument(): void;
    protected abstract doDestroySelf(): void;



}

import {iAddressFormatter} from "../../common/models/iAddressFormatter";

const cryptoRandomString = require('crypto-random-string');

import {iSubscriptionTracker} from "../../common/models/iSubscriptionTracker";
import { iView, HtmlString } from "../models/iView";
import {iStore} from "../../store/models/iStore";
import {iDispatcher} from "../../dispatcher/models/iDispatcher";
import {iViewRegistry} from "../models/iViewRegistry";

export interface iBaseViewDependencies {
    dispatcher: iDispatcher,
    store: iStore,
    subscriptionTracker: iSubscriptionTracker,
    viewRegistry: iViewRegistry,
    addressFormatter: iAddressFormatter
}

export abstract class BaseView extends HTMLElement implements iView {
    private _ownTemplate: string;

    //ids which will be created and used by subclass to get / set values inside of spans
    private spanInterpolators: {[key: string]: string} = {};
    protected modules: iBaseViewDependencies;


    init(modules: iBaseViewDependencies) {
        this.modules = modules;

        this.id = this.id || this.getUniqueId();
        this._ownTemplate = this.doInit();
        this.innerHTML = this.template;
        this.innerHTML = this.template;
        this.onPlacedInDocument();
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

    protected getUniqueId(): string {
        return "e"+cryptoRandomString({length: 10});
    }


    private doDestroy() {
        this.doDestroySelf();
        this.modules.subscriptionTracker.unsubscribeAll();
    }

    abstract get viewName(): string;
    protected abstract doInit(): HtmlString;
    protected abstract onPlacedInDocument(): void;
    protected abstract doDestroySelf(): void;



}
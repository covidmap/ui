import {iViewRegistry} from "../models/iViewRegistry";
import {BaseView} from "../views/baseView";
import {RawOutputView} from "../views/rawOutput/rawOutput.view";
import {AppView} from "../views/appView";

export class ViewRegistry implements iViewRegistry {

    selectors: { [p: string]: string } = {};

    constructor() {
        const viewClasses = [
            RawOutputView,
            AppView
        ];

        viewClasses.forEach(viewClass => {
            const name = viewClass.prototype.constructor.name;
            const selector = this.getSelectorName(name);
            this.selectors[name] = selector;

            try {
                //@ts-ignore
                window.customElements.define(selector,viewClass.constructor);
            } catch (err) {
                //already registered
            }
        });
    }

    private getSelectorName(constructorName: string): string {
        return constructorName.trim().split(/(?=[A-Z])/).join('-').toLowerCase();
    }

}
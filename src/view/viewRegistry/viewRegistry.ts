import {iViewRegistry} from "../models/iViewRegistry";
import {AppMain} from "../views/appMain";
import {HospitalRawOutput} from "../views/rawOutput/hospitalRawOutput.view";
import {iBaseViewDependencies} from "../views/baseView";

export class ViewRegistry implements iViewRegistry {

    selectors: { [p: string]: string } = {};

    constructor() {

        const viewClasses = [
            HospitalRawOutput,
            AppMain
        ];

        viewClasses.forEach(viewClass => {
            const name = viewClass.prototype.constructor.name;
            const selector = this.getSelectorName(name);
            this.selectors[name] = selector;

            try {
                //@ts-ignore
                window.customElements.define(selector,viewClass);
            } catch (err) {
                //already registered
            }
        });
    }

    private getSelectorName(constructorName: string): string {
        return constructorName.trim().split(/(?=[A-Z])/).join('-').toLowerCase();
    }

}
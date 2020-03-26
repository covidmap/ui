import {InputDuration} from "./inputDuration/inputDuration";

export class CustomElementsRegistry {

    selectors: { [p: string]: string } = {};

    constructor() {

        const customElements = [
            InputDuration
        ];


        customElements.forEach(element => {
            const name = element.prototype.constructor.name;
            const selector = this.getSelectorName(name);
            this.selectors[name] = selector;

            try {
                //@ts-ignore
                window.customElements.define(selector,element);
            } catch (err) {
                //already registered
            }
        });
    }

    private getSelectorName(constructorName: string): string {
        return constructorName.trim().split(/(?=[A-Z])/).join('-').toLowerCase();
    }

}
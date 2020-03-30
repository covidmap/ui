export type InputDurationMinUnit = "millisecond" | "second" | "minute" | "hour" | "day";

export class InputDuration extends HTMLElement {

    shadowRoot: any;
    //@ts-ignore
    private rawValue: number = null;
    //@ts-ignore
    private _minUnit: InputDurationMinUnit = null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.initValues();
    }

    static get observedAttributes(): Array<string> {
        return ["value","min_unit"];
    }

    attributeChangedCallback(attrName: string,oldValue: any,newValue: any): void {
        if (oldValue === newValue) { return; }

        switch (attrName.toLowerCase()) {
            case "value":
                this.value = newValue;
                break;
            case "min_unit":
                this.min_unit = newValue;
                break;
        }
    }

    private initValues(): void {
        //@ts-ignore
        this.value = this.getAttribute('value')?parseInt(this.getAttribute('value')):0;
        //@ts-ignore
        this.minUnit = this.getAttribute('min_unit') || "hour";

    }

    //@ts-ignore
    set value(value: number) {
        this.rawValue = value;
        this.updateValueInShadow();
        this.setAttribute('value',value+"");
    }

    //@ts-ignore
    get value(): number {
        return this.rawValue;
    }

    private updateValueInShadow(): void {
        const {
            msInput,
            secInput,
            minInput,
            hourInput,
            dayInput
        } = this.queryElements();

        let intermediate = this.rawValue;
        const days = Math.max(Math.floor(intermediate / (1000 * 60 * 60 * 24)),0);
        intermediate -= days * 1000 * 60 * 60 * 24;
        const hours = Math.max(Math.floor(intermediate / (1000 * 60 * 60)),0);
        intermediate -= hours * 1000 * 60 * 60;
        const minutes = Math.max(Math.floor(intermediate / (1000 * 60)),0);
        intermediate -= minutes * 1000 * 60 ;
        const seconds = Math.max(Math.floor(intermediate / 1000),0);
        intermediate -= seconds;
        const ms = Math.max(Math.floor(intermediate),0);

        msInput && (msInput.value = ms);
        secInput && (secInput.value = seconds);
        minInput && (minInput.value = minutes);
        hourInput && (hourInput.value = hours);
        dayInput && (dayInput.value = days);
    }

    get min_unit() {
        return this._minUnit;
    }

    set min_unit(minUnit: InputDurationMinUnit) {
        this._minUnit = minUnit;
        const htmlParts: Array<string> = [];

        switch (minUnit) {
            case 'millisecond':
                htmlParts.push(`<label for='milliseconds'>Milliseconds:</label><input name="milliseconds" type="number" step="1" min="0" max="999"/>`);
            case 'second':
                htmlParts.push(`<label for='seconds'>Seconds:</label><input name="seconds" type="number" step="1" min="0" max="59"/>`);
            case 'minute':
                htmlParts.push(`<label for='minutes'>Minutes:</label><input name="minutes" type="number" step="1" min="0" max="59"/>`);
            case 'hour':
                htmlParts.push(`<label for='hours'>Hours:</label><input name="hours" type="number" step="1" min="0" max="59"/>`);
            case 'day':
                htmlParts.push(`<label for='days'>Days:</label><input name="days" type="number" step="1" min="0" max="59"/>`);
                break;
        }

        this.shadowRoot.innerHTML = htmlParts.reverse().join("");

        const {
            msInput,
            secInput,
            minInput,
            hourInput,
            dayInput
        } = this.queryElements();


        msInput && msInput.addEventListener('change',this.updateValueFromShadow.bind(this));
        secInput && secInput.addEventListener('change',this.updateValueFromShadow.bind(this));
        minInput && minInput.addEventListener('change',this.updateValueFromShadow.bind(this));
        hourInput && hourInput.addEventListener('change',this.updateValueFromShadow.bind(this));
        dayInput && dayInput.addEventListener('change',this.updateValueFromShadow.bind(this));
    }

    private updateValueFromShadow(): void {
        const {
            msInput,
            secInput,
            minInput,
            hourInput,
            dayInput
        } = this.queryElements();

        const ms = msInput ? msInput.value : 0;
        const sec = secInput ? secInput.value : 0;
        const min = minInput ? minInput.value : 0;
        const hour = hourInput ? hourInput.value : 0;
        const day = dayInput ? dayInput.value : 0;

        const totalValue = ms
            + sec * 1000
            + min * 60 * 1000
            + hour * 60 * 60 * 1000
            + day * 24 * 60 * 60 * 1000;
        this.value = totalValue;
    }

    private queryElements() {
        const msInput = this.shadowRoot.querySelector("input[name=milliseconds]");
        const secInput = this.shadowRoot.querySelector("input[name=seconds]");
        const minInput = this.shadowRoot.querySelector("input[name=minutes]");
        const hourInput = this.shadowRoot.querySelector("input[name=hours]");
        const dayInput = this.shadowRoot.querySelector("input[name=days]");

        return {
            msInput,
            secInput,
            minInput,
            hourInput,
            dayInput
        }
    }

}
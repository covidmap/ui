/**
 *
 * <accordion-container>
 *      <accordion-element header="Header"><p>Contents</p></accordion-element>
 * </accordion-container>
 *
 */

export class AccordionElement extends HTMLElement {

    private _header: string;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const slot = document.createElement("slot");

        //@ts-ignore
        const shadow = this.shadowRoot!;
        const detail = document.createElement('details');
        const summary = document.createElement('summary');
        detail.appendChild(summary);
        detail.appendChild(slot);

        shadow.appendChild(detail);
    }

    connectedCallback() {
        this.header = this.getAttribute('header') || "";
    }

    set header(header: string) {
        this._header = header;
        this.getShadowHeaderElement().innerHTML = this._header;
    }

    get header(): string {
        return this._header;
    }

    private getShadowHeaderElement(): HTMLElement {
        //@ts-ignore
        return this.shadowRoot.querySelector("summary");
    }

}

export class AccordionContainer extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const slot = document.createElement("slot");

        //@ts-ignore
        const shadow = this.shadowRoot!;
        shadow.appendChild(slot);
    }

}
import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";
import { DISPATCHER_MESSAGES } from "../../../dispatcher/dispatcher.messages";


export class MenuBar extends BaseView {

    protected doDestroySelf(): void { }

    protected doInit(): HtmlString {

        return `
            <div class="header-container">
            <h1 class="title">Covid App</h1>
            <nav>
            <div class="${this.classListenName} nav-item" data-selector="${this.modules.viewRegistry.selectors.HospitalRawOutput}">Raw Output</div>
            <div class="${this.classListenName} nav-item" data-selector="${this.modules.viewRegistry.selectors.SingleHospitalDetails}">Single Hospital</div>
            <div class="${this.classListenName} nav-item" data-selector="${this.modules.viewRegistry.selectors.AboutApp}">About App</div>
            </nav>
            </div>
        `;
    }

    private get classListenName(): string {
        return `menuBar_selector_${this.id}`;
    }

    protected onPlacedInDocument(): void {
        let that = this;
        Array.from(document.getElementsByClassName(this.classListenName)).forEach(obj => {
            obj.addEventListener('click', function () {
                const selector = this.dataset.selector;
                that.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.CurrentPageChanged, selector);
            });
        });
    }

}
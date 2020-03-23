import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";
import { DISPATCHER_MESSAGES } from "../../../dispatcher/dispatcher.messages";


export class MenuBar extends BaseView {

    protected doDestroySelf(): void { }

    protected doInit(): HtmlString {

        const Choices = [
            ["Index",this.modules.viewRegistry.selectors.IndexMain],
            ["About App",this.modules.viewRegistry.selectors.AboutApp],
            ["Hospital Map",this.modules.viewRegistry.selectors.HospitalMap],
            ["Report Form",this.modules.viewRegistry.selectors.ReportForm],
            ["Debug",this.modules.viewRegistry.selectors.HospitalRawOutput]
        ];

        const innerMenu = Choices.reduce((html,choice) => {
            return html + `<div class="${this.classListenName} nav-item" data-selector="${choice[1]}">${choice[0]}</div>`
        },"");

        return `
            <div class="header-container">
            <h1 class="title">Covid App</h1>
            <nav>
                ${innerMenu}
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

        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.CurrentPageSelector$,
            (data: string) => {
                Array.from(document.getElementsByClassName(this.classListenName)).forEach((innerObj) => {
                    //@ts-ignore
                    if (innerObj.dataset.selector === data) {
                        innerObj.classList.add("menuSelected");
                    } else {
                        innerObj.classList.remove("menuSelected");
                    }
                });
            }
        )
    }

}
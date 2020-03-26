import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";
import { DISPATCHER_MESSAGES } from "../../../dispatcher/dispatcher.messages";
import {ENVIRONMENTS} from "../../../bootstrap/bootstrapper";


export class MenuBar extends BaseView {

    protected doDestroySelf(): void { }

    protected doInit(): HtmlString {

        const Choices = [
            ["Hospital Map",this.modules.viewRegistry.selectors.HospitalMap,"main"],
            ["About",this.modules.viewRegistry.selectors.AboutApp,"margin"],
            ["Report Form",this.modules.viewRegistry.selectors.ReportForm,"margin"]
        ];

        if (this.modules.store.state.environment === ENVIRONMENTS.Dev) {
            Choices.push(["Debug",this.modules.viewRegistry.selectors.HospitalRawOutput,"margin"]);
        }

        const innerMenu = Choices.reduce((html,choice) => {
            return html + `<div class="${this.classListenName} nav-item" data-selector="${choice[1]}" data-class="${choice[2]}">${choice[0]}</div>`
        },"");

        const hamburgerIcon = 
          `<a href="javascript:void(0);" class="icon" id="hamburger">
            <span class="material-icons">menu</span>
          </a>`;

        return `
            <div class="header-container">
                <h1 class="title">Covid Impact Map</h1>
                <nav class="topnav">
                    ${innerMenu}
                    ${hamburgerIcon}
                </nav>
            </div>
        `;
    }

    private get classListenName(): string {
        return `menuBar_selector_${this.id}`;
    }

    protected onPlacedInDocument(): void {
        let that = this;
        //@ts-ignore
        const navBar = document.getElementById(this.id).getElementsByTagName("nav")[0]!;
        
        Array.from(document.getElementsByClassName(this.classListenName)).forEach(obj => {
            this.modules.subscriptionTracker.addEventListenerTo(obj,'click',function() {
                const selector = this.dataset.selector;
                const mainClass = this.dataset.class;
                that.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.CurrentPageChanged,selector);
                that.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.CurrentPageDisplayClass,mainClass);
            });
        });

        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.CurrentPageSelector$,
            (data: string) => {
                Array.from(document.getElementsByClassName(this.classListenName)).forEach((innerObj) => {
                    navBar.className = "topnav";
                    //@ts-ignore
                    if (innerObj.dataset.selector === data) {
                        innerObj.classList.add("menuSelected");
                    } else {
                        innerObj.classList.remove("menuSelected");
                    }
                });
            }
        )

        // TODO(jen): probably not the best way to do this, just trying to get it working
        const hamburgerIcon = document.getElementById("hamburger")!;
        this.modules.subscriptionTracker.addEventListenerTo(
          hamburgerIcon,'click', () => {
            if (navBar.className === "topnav") {
              navBar.className += " responsive";
            } else {
              navBar.className = "topnav";
            }
          }
        );
    }
}

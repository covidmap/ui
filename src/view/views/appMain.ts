import {BaseView} from "./baseView";
import {HtmlString} from "../models/iView";
import {MenuBar} from "./menubar/menuBar.view";

interface iAppMainSpanNames {
    page: string
};

export class AppMain extends BaseView {

    private menuBarId: string;

    private spanNames: iAppMainSpanNames = {
        page: "page"
    };

    protected doInit(): HtmlString {
        this.menuBarId = this.getUniqueId();

        const pageSpan = this.registerSpanInterpolator(this.spanNames.page);
        const menuBarSelector = this.modules.viewRegistry.selectors.MenuBar;

        return `
            <${menuBarSelector} id="${this.menuBarId}"></${menuBarSelector}>
            
            ${pageSpan}
        `;
    }
    
    protected onPlacedInDocument(): void {
        const menu = <MenuBar>document.getElementById(this.menuBarId)!;
        menu.init(this.modules);

        this.listenToPageChange();
    }

    private listenToPageChange() {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.CurrentPageSelector$,
            (data: string) => {
                this.changePage(data);
            }
        );
    }

    private changePage(selector: string): void {
        const oldEl = this.getSpanInterpolatorElement(this.spanNames.page);
        const oldPageElement = <BaseView>oldEl.childNodes[0];
        if (oldPageElement) {
            oldPageElement.destroy();
        }

        this.updateSpanHtml(this.spanNames.page,`<${selector}></${selector}>`);
        const el = this.getSpanInterpolatorElement(this.spanNames.page);
        const pageElement = <BaseView>el.childNodes[0];
        pageElement.init(this.modules);
    }

    protected doDestroySelf(): void {}


}
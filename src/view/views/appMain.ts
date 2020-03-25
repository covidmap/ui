import { BaseView } from "./baseView";
import { HtmlString } from "../models/iView";
import { MenuBar } from "./menubar/menuBar.view";
import {LoadingCover} from "./loadingCover/loadingCover";

interface iAppMainSpanNames {
    page: string
};

export class AppMain extends BaseView {

    private menuBarId: string;
    private loadingCoverId: string;
    private mainId: string;

    private spanNames: iAppMainSpanNames = {
        page: "page"
    };

    protected doInit(): HtmlString {
        this.menuBarId = this.getUniqueId();
        this.loadingCoverId = this.getUniqueId();
        this.mainId = this.getUniqueId();

        const pageSpan = this.registerSpanInterpolator(this.spanNames.page);
        const menuBarSelector = this.modules.viewRegistry.selectors.MenuBar;

        const loadingSelector = this.modules.viewRegistry.selectors.LoadingCover;

        return `
            <${loadingSelector} id="${this.loadingCoverId}"></${loadingSelector}>

            <${menuBarSelector} id="${this.menuBarId}"></${menuBarSelector}>
            
            <main id="${this.mainId}" class="main">${pageSpan}</main>
        `;
    }
    
    protected onPlacedInDocument(): void {
        const menu = <MenuBar>document.getElementById(this.menuBarId)!;
        menu.init(this.modules);

        const loadingElement = <LoadingCover>document.getElementById(this.loadingCoverId)!;
        loadingElement.init(this.modules);

        this.listenToPageChange();
        this.listenToPageClassChange();
    }

    private listenToPageChange() {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.CurrentPageSelector$,
            (data: string) => {
                this.changePage(data);
            }
        );
    }

    private listenToPageClassChange() {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.CurrentPageDisplayClass$,
            (data: string) => {
                //@ts-ignore
                document.getElementById(this.mainId).className = data;
            }
        );
    }

    private changePage(page: string): void {
        this.updateSpanHtml(this.spanNames.page, `<${page}></${page}>`);
        //@ts-ignore
        const el = this.getSpanInterpolatorElement(this.spanNames.page);
        const pageElement = <BaseView>el.childNodes[0];
        pageElement.init(this.modules);
    }

    protected doDestroySelf(): void { }


}
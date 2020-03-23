import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";

export class IndexMain extends BaseView {

    protected doInit(): HtmlString {
        return `
            <h2>Welcome to the App!</h2>
            <p>Use the menubar above to navigate.  To load data, goto raw output and click refresh.</p>
        `;
    }

    protected onPlacedInDocument(): void {
    }

    protected doDestroySelf(): void {
    }



}
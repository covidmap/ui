import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";

export class ReportForm extends BaseView {

    protected doInit(): HtmlString {
        return `
            <h2>Report Form</h2>
            <p>Welcome to the report form</p>
        `;
    }

    protected onPlacedInDocument(): void {
    }

    protected doDestroySelf(): void {
    }

}
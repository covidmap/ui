import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";

export class ReportForm extends BaseView {

    protected doInit(): HtmlString {

        return `
            <h2>Report Form</h2>

        `;
    }

    protected onPlacedInDocument(): void {
        this.initForm();
    }

    private initForm() {

    }

    protected doDestroySelf(): void {
    }

}
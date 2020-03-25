import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";

export class AboutApp extends BaseView {
    protected doDestroySelf(): void {
    }

    protected doInit(): HtmlString {
        return `
            <h2>About this App</h2>
            <p>COVIDMap aggregates status reports from the frontlines of American healthcare to enable everyone, from policymakers to folks at home, to take more informed, effective action.</p>
        `;
    }

    protected onPlacedInDocument(): void {
    }


}


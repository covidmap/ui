import {BaseView} from "./baseView";
import {HtmlString} from "../models/iView";
import {HospitalRawOutput} from "./rawOutput/hospitalRawOutput.view";

export class AppMain extends BaseView {

    private hospitalRawId: string;

    protected doInit(): HtmlString {
        const selector = this.modules.viewRegistry.selectors.HospitalRawOutput;
        this.hospitalRawId = this.getUniqueId();

        return `
            <h1>Main App</h1>
            <${selector} id="${this.hospitalRawId}"></${selector}>
        `;
    }

    get selector(): string {
        return "app-main";
    }

    protected onPlacedInDocument(): void {
        const hospitalRaw = <HospitalRawOutput>document.getElementById(this.hospitalRawId)!;
        hospitalRaw.init(this.modules);
    }

    get viewName(): string {
        return "MainApp";
    }

    protected doDestroySelf(): void {}


}